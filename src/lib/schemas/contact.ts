// lib/schemas/contact.ts
import { z } from "zod";

// critères de validité des saisies
export const contactSchema = z.object({
  prenomNom: z
    .string().min(1, "Ce champ est obligatoire")
    .regex(/^[a-zA-ZÀ-ÿ-]{2,}(?:\s+[a-zA-ZÀ-ÿ-]{2,})+$/,"Saisissez votre prénom (min. 2 lettres), un espace, puis votre nom (min. 2 lettres)"),

  email: z.string().email("Adresse e-mail invalide"),

  telephone: z.string().optional().refine((val) => !val || /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(val),"Numéro de téléphone invalide"),

  sujet: z.string().min(3, "Le type de soins doit contenir au moins 3 caractères"),

  message: z.string().min(10, "Ce champ est obligatoire et le message doit contenir au moins 10 caractères"),

  // Honeypot : doit impérativement rester vide
  website: z.string().max(0, "Bot détecté"),
});

export type ContactFormData = z.infer<typeof contactSchema>;