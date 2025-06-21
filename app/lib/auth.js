import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  // Configure one or more authentication providers
  secret: process.env.AUTH_SECRET || "MySuperSecureSecretKey123!@#",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text"  },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        try {
          // Form verisini API'ye gönder
          const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials), // Form verilerini JSON olarak gönder
          });


          // API'den gelen yanıtı işleme
          if (response.ok) {
            const result = await response.json();
            console.log("Form submitted successfully!", result);
            return {
              token: result.token,
              ...result.user
            }
          } else {
            const result = await response.json();
            return {
              error: result.message
            }
          }
        } catch (error) {
          return {
            error: error.message
          }
        }
      },
      session: {
        strategy: "jwt",
      },
      pages: {
        signIn: "/login", // Özel giriş sayfanızın yolu
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) 
    {
        if(user?.error) {
          throw new Error(user.error)
        }

        return true
    },
    async session({ session, user, token }) {
      if (token) {
        session.user.token = token.token; // JWT'deki token'ı session'a ekle
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user?.token) {
        token.token = user.token;
      }
      return token
    }
  }
};
