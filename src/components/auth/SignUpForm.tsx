
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const signupSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phoneNumber: z
    .string()
    .min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres")
    .regex(/^[0-9+ ()-]{10,15}$/, "Format de téléphone invalide"),
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

export type SignUpFormValues = z.infer<typeof signupSchema>;

export const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });
  
  const handleSubmit = async (values: SignUpFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await signup(
        values.email, 
        values.password, 
        values.firstName, 
        values.lastName, 
        values.phoneNumber
      );
      
      toast({
        title: "Compte créé avec succès",
        description: "Bienvenue sur votre portail client Botnb."
      });
      
      navigate("/");
    } catch (error: any) {
      console.error("Error during signup:", error);
      
      let errorMessage = "Échec de la création du compte. Veuillez réessayer.";
      
      // Gestion spécifique des erreurs
      if (error.message) {
        if (error.message.includes("already been registered")) {
          errorMessage = "Cette adresse email est déjà utilisée.";
        } else if (error.message.includes("password")) {
          errorMessage = "Le mot de passe ne répond pas aux critères de sécurité.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      
      toast({
        title: "Erreur d'inscription",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4 animate-fade-in">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro de téléphone</FormLabel>
                <FormControl>
                  <Input 
                    type="tel"
                    placeholder="06 12 34 56 78" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="votre@email.com" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input 
                    type="password"
                    placeholder="••••••••" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <FormControl>
                  <Input 
                    type="password"
                    placeholder="••••••••" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Création en cours..." : "S'inscrire"}
          </Button>
        </form>
      </Form>
    </>
  );
};
