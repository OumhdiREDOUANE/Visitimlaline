import { getI18n } from '@/lib/i18n/server.js';
import { requireUser } from '@/lib/auth/guards.js';
import { CheckInForm } from '@/components/staff/CheckInForm.js';
import { Card } from '@/components/ui/Card.js';

export default async function CheckInPage() {
  const { t } = await getI18n();
  await requireUser('/staff/check-in');

  return (
    <div className="page-shell flex flex-col gap-8 py-10">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl">
          {t('checkIn.title')}
        </h1>
        <p className="max-w-xl text-muted">
          {t('checkIn.lead')}
        </p>
      </header>

      <Card
        wave
        className="max-w-xl p-6"
      >
        <CheckInForm />
      </Card>
    </div>
  );
}
