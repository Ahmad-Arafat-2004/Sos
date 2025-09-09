import { supabase, shouldSkipSupabase } from "../lib/supabase";
import type {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ApiResponse,
} from "../../shared/types";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export class AuthService {
  // Generate JWT token
  private generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  // Verify JWT token
  verifyToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  // Register new user
  async register(
    userData: RegisterRequest,
  ): Promise<ApiResponse<AuthResponse>> {
    if (shouldSkipSupabase()) {
      try {
        const { localDb } = await import("../lib/local-db");
        const existing = localDb.getUserByEmail(userData.email);
        if (existing) {
          return {
            success: false,
            error: "User already exists with this email",
          };
        }
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        const newUser = localDb.createUser({
          email: userData.email,
          name: userData.name,
          password_hash: hashedPassword,
          role: "user",
        });
        const token = this.generateToken(newUser.id);
        return {
          success: true,
          data: {
            user: {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              role: newUser.role,
              created_at: newUser.created_at,
              updated_at: newUser.updated_at,
            },
            token,
          },
          message: "User registered successfully",
        };
      } catch (e) {
        return { success: false, error: "Failed to register user" };
      }
    }

    try {
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", userData.email)
        .single();

      if (existingUser) {
        return {
          success: false,
          error: "User already exists with this email",
        };
      }

      // Create user in Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
          },
        },
      });

      if (authError) {
        return {
          success: false,
          error: authError.message,
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: "Failed to create user",
        };
      }

      // Create user profile in our users table
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .insert({
          id: authData.user.id,
          email: userData.email,
          name: userData.name,
          role: "user",
        })
        .select()
        .single();

      if (profileError) {
        return {
          success: false,
          error: profileError.message,
        };
      }

      const user: User = {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.role,
        created_at: userProfile.created_at,
        updated_at: userProfile.updated_at,
      };

      const token = this.generateToken(user.id);

      // Also persist the newly created user into local JSON database as a fallback
      try {
        const { localDb } = await import("../lib/local-db");
        const existingLocal = localDb.getUserByEmail(user.email);
        if (!existingLocal) {
          // hashedPassword was computed earlier in this function
          await localDb.createUser({
            email: user.email,
            name: user.name,
            password_hash: hashedPassword,
            role: user.role,
          });
        }
      } catch (e) {
        // ignore errors while writing local fallback
        console.warn("Failed to persist user to local JSON fallback:", e);
      }

      return {
        success: true,
        data: { user, token },
        message: "User registered successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to register user",
      };
    }
  }

  // Login user
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    if (shouldSkipSupabase()) {
      try {
        const { localDb } = await import("../lib/local-db");
        const user = localDb.getUserByEmail(credentials.email);
        if (!user) {
          return { success: false, error: "Invalid email or password" };
        }
        const ok = await bcrypt.compare(
          credentials.password,
          user.password_hash,
        );
        if (!ok) {
          return { success: false, error: "Invalid email or password" };
        }
        const token = this.generateToken(user.id);
        return {
          success: true,
          data: {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              created_at: user.created_at,
              updated_at: user.updated_at,
            },
            token,
          },
          message: "Login successful",
        };
      } catch (e) {
        return { success: false, error: "Failed to login" };
      }
    }

    try {
      // Sign in with Supabase auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

      if (authError) {
        return {
          success: false,
          error: "Invalid email or password",
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: "Authentication failed",
        };
      }

      // Get user profile
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (profileError) {
        return {
          success: false,
          error: "User profile not found",
        };
      }

      const user: User = {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        role: userProfile.role,
        created_at: userProfile.created_at,
        updated_at: userProfile.updated_at,
      };

      const token = this.generateToken(user.id);

      return {
        success: true,
        data: { user, token },
        message: "Login successful",
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to login",
      };
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<ApiResponse<User>> {
    if (shouldSkipSupabase()) {
      try {
        const { localDb } = await import("../lib/local-db");
        const user = localDb.getUserById(id);
        if (!user) return { success: false, error: "User not found" };
        return {
          success: true,
          data: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
        };
      } catch (e) {
        return { success: false, error: "Failed to fetch user" };
      }
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        return {
          success: false,
          error: "User not found",
        };
      }

      const user: User = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch user",
      };
    }
  }

  // Update user profile
  async updateUser(
    id: string,
    userData: Partial<User>,
  ): Promise<ApiResponse<User>> {
    if (shouldSkipSupabase()) {
      try {
        const { localDb } = await import("../lib/local-db");
        const updates: any = {};
        if (userData.name) updates.name = userData.name;
        if (userData.email) updates.email = userData.email;
        if (userData.role) updates.role = userData.role;
        const updated = localDb.updateUser(id, updates);
        if (!updated) return { success: false, error: "User not found" };
        return {
          success: true,
          data: {
            id: updated.id,
            email: updated.email,
            name: updated.name,
            role: updated.role,
            created_at: updated.created_at,
            updated_at: updated.updated_at,
          },
          message: "User updated successfully",
        };
      } catch (e) {
        return { success: false, error: "Failed to update user" };
      }
    }

    try {
      const updateData: any = {};
      if (userData.name) updateData.name = userData.name;
      if (userData.email) updateData.email = userData.email;
      if (userData.role) updateData.role = userData.role;

      const { data, error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      const user: User = {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      return {
        success: true,
        data: user,
        message: "User updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to update user",
      };
    }
  }

  // Refresh token
  async refreshToken(token: string): Promise<ApiResponse<AuthResponse>> {
    const decoded = this.verifyToken(token);

    if (!decoded) {
      return {
        success: false,
        error: "Invalid token",
      };
    }

    const userResult = await this.getUserById(decoded.userId);

    if (!userResult.success || !userResult.data) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const newToken = this.generateToken(userResult.data.id);

    return {
      success: true,
      data: { user: userResult.data, token: newToken },
      message: "Token refreshed successfully",
    };
  }
}

export const authService = new AuthService();
