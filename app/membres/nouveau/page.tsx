'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { estConnecte } from '@/lib/api';
import { FournisseurFormulaireMembre, useMemberForm } from '@/lib/member-form/context';
import BarreNavigationBasse from '@/components/BarreNavigationBasse';
import StepIndicator from '@/components/member-form/StepIndicator';
import IdentificationStep from '@/components/member-form/IdentificationStep';
import MaritalStatusStep from '@/components/member-form/MaritalStatusStep';
import SpiritualInfoStep from '@/components/member-form/SpiritualInfoStep';
import SpouseStep from '@/components/member-form/SpouseStep';
import ChildrenStep from '@/components/member-form/ChildrenStep';
import ObservationStep from '@/components/member-form/ObservationStep';
import SummaryStep from '@/components/member-form/SummaryStep';

function ContenuFormulaire() {
  const { etapeCourante, allerA, etapesValidees } = useMemberForm();
  const estRecapitulatif = etapeCourante === 7;

  return (
    <main className="mx-auto max-w-2xl px-4 pb-28 pt-6">
      {!estRecapitulatif && (
        <StepIndicator etapeCourante={etapeCourante} etapesValidees={etapesValidees} onClicEtape={allerA} />
      )}

      <div key={etapeCourante} className="animate-entree-etape">
        {etapeCourante === 1 && <IdentificationStep />}
        {etapeCourante === 2 && <MaritalStatusStep />}
        {etapeCourante === 3 && <SpiritualInfoStep />}
        {etapeCourante === 4 && <SpouseStep />}
        {etapeCourante === 5 && <ChildrenStep />}
        {etapeCourante === 6 && <ObservationStep />}
        {estRecapitulatif && <SummaryStep />}
      </div>

      <BarreNavigationBasse />
    </main>
  );
}

export default function PageNouveauMembre() {
  const router = useRouter();

  useEffect(() => {
    if (!estConnecte()) router.push('/connexion');
  }, [router]);

  return (
    <FournisseurFormulaireMembre>
      <ContenuFormulaire />
    </FournisseurFormulaireMembre>
  );
}
