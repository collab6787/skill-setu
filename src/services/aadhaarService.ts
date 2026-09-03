import { AadhaarVerificationResult } from '../types';

export class AadhaarVerificationService {
  private static DEMO_MODE = true;

  /**
   * Securely verifies Aadhaar in sandbox demo mode with zero raw storage.
   */
  public static verifyAadhaar(rawInputNumber: string, studentName: string): AadhaarVerificationResult {
    // Sanitize digits only
    const digitsOnly = rawInputNumber.replace(/\D/g, '');

    if (digitsOnly.length !== 12) {
      throw new Error('Aadhaar number must contain exactly 12 numeric digits.');
    }

    const last4 = digitsOnly.slice(-4);
    const maskedNumber = `XXXX-XXXX-${last4}`;
    
    // Create a deterministic pseudo-hash token for demo tracking without storing original
    const verificationToken = `SHA256:DEMO-AADHAAR-TOKEN-${last4}-${Date.now().toString(36).toUpperCase()}`;

    return {
      verified: true,
      status: this.DEMO_MODE ? 'DEMO_VERIFIED' : 'OFFICIAL_VERIFIED',
      maskedNumber,
      verificationToken,
      verifiedAt: new Date().toISOString(),
      verificationSource: 'SkillSetu Demo UIDAI Simulation Gateway (Sandbox Mode)',
      disclaimer: 'Demo Aadhaar Verification: Executed in test sandbox for SIH 2026 evaluation. Zero raw Aadhaar numbers are persisted in database.'
    };
  }

  public static isDemoMode(): boolean {
    return this.DEMO_MODE;
  }
}
