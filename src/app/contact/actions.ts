// app/contact/actions.ts
"use server";

import { Resend } from "resend";
import { contactSchema, ContactFormData } from "@/lib/schemas/contact";
import { siteConfig } from "@/config/site";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
const nomSite = siteConfig.name; // fvsoft1963
const nomSiteMaj = nomSite.toUpperCase(); // FVSOFT1963
const urlSite = siteConfig.url; // https://fvsoft1963.com

export async function sendContactEmail(data: ContactFormData) {
  const emailTo = process.env.NEXT_PUBLIC_EMAIL_TO;

  // 1. Validation Runtime + Narrowing TypeScript automatique
  if (!emailTo) {
    console.error("action.ts ERREUR: La variable d'environnement EMAIL_TO n'est pas définie.");
    return { success: false, error: "Configuration serveur incomplète: EMAIL_TO inconnu" };
  }

  // 2. Validation robuste côté serveur
  const result = contactSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: "Données de formulaire invalides." };
  }

  const { prenomNom, email, telephone, sujet, message, website } = result.data;

  // 3. Traitement Anti-Spam Honeypot
  if (website && website.length > 0) {
    // Faux succès pour leurrer les bots sans consommer de quota Resend
    return { success: true };
  }

  // 4. Envoi via l'API Resend
  try {
    const { error } = await resend.emails.send({
      from: `${nomSite}.com <onboarding@resend.dev>`,
      //to: [emailTo], pose problème avec next build? NON!
      to: [emailTo],
      replyTo: email,
      subject: `[${nomSiteMaj} Contact] ${sujet}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Message de contact issu de ${urlSite}</h2>
          <p><strong>Expéditeur :</strong> ${prenomNom}</p>
          <p><strong>E-mail :</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Téléphone :</strong> ${telephone || "Non renseigné"}</p>
          <p><strong>Sujet :</strong> ${sujet}</p>
          <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;" />
          <h3>Message :</h3>
          <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; rounded: 8px;">${message}</p>
        </div>
      `,
    });

    if (error) {
      console.error("action.ts Erreur Resend :", error);
      const isNetworkError = error.statusCode === null || error.name === "application_error"; // selon Resend API Error avec statusCode = null path: /emails
      return {
        success: false,
        error: isNetworkError ? "Connexion au service d'envoi Resend impossible. Vérifiez votre connexion internet." : "Impossible d'envoyer votre message pour le moment.",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("action.ts/catch Erreur Resend inattendue:", err);
    return { success: false, error: "Erreur inconnue. Impossible d'envoyer votre message pour le moment." };
  }
}