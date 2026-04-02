import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { fetchRaceCalendarById } from '../lib/raceCalendar';
import { createPaymentCheckout } from '../lib/paymentApi';

type RegistrationFormState = {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  clubTeam: string;
  nation: string;
  startingClass: string;
  uciLicenseNumber: string;
  email: string;
  privacyAccepted: boolean;
};

type RegistrationFormErrors = Partial<
  Record<keyof RegistrationFormState, string>
>;

const initialFormState: RegistrationFormState = {
  firstName: 'Kostas',
  lastName: 'Testing',
  birthDate: '2000-01-01',
  gender: 'male',
  clubTeam: 'Test',
  nation: 'GER',
  startingClass: 'Amateur',
  uciLicenseNumber: '',
  email: 'test@gmail.com',
  privacyAccepted: true,
};

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

function validateForm(
  state: RegistrationFormState,
  isEliteClassSelected: boolean
): RegistrationFormErrors {
  const errors: RegistrationFormErrors = {};

  if (!state.firstName.trim()) {
    errors.firstName = 'First name is required.';
  }

  if (!state.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  }

  if (!state.birthDate) {
    errors.birthDate = 'Birth date is required.';
  }

  if (!state.gender) {
    errors.gender = 'Gender is required.';
  }

  if (!state.nation.trim()) {
    errors.nation = 'Nation is required.';
  }

  if (!state.startingClass) {
    errors.startingClass = 'Starting class is required.';
  }

  if (isEliteClassSelected && !state.uciLicenseNumber.trim()) {
    errors.uciLicenseNumber = 'UCI license number is required for Elite class.';
  }

  if (!state.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!state.privacyAccepted) {
    errors.privacyAccepted = 'You must accept the privacy policy.';
  }

  return errors;
}

export function RaceRegistrationPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [formState, setFormState] =
    useState<RegistrationFormState>(initialFormState);
  const [errors, setErrors] = useState<RegistrationFormErrors>({});
  const [submitError, setSubmitError] = useState('');

  const {
    data: race,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['race-registration', slug],
    queryFn: () => fetchRaceCalendarById(slug ?? ''),
    enabled: Boolean(slug),
  });

  const sortedSubRaces = useMemo(() => {
    if (!race?.subRaces) {
      return [];
    }

    return [...race.subRaces].sort((a, b) => {
      const left = a.sortOrder ?? 999;
      const right = b.sortOrder ?? 999;
      return left - right;
    });
  }, [race]);

  useEffect(() => {
    if (sortedSubRaces.length === 0) {
      setFormState(current => ({ ...current, startingClass: '' }));
      return;
    }

    setFormState(current => {
      if (
        current.startingClass &&
        sortedSubRaces.some(subRace => subRace.id === current.startingClass)
      ) {
        return current;
      }

      return {
        ...current,
        startingClass: sortedSubRaces[0].id,
      };
    });
  }, [sortedSubRaces]);

  const paymentMutation = useMutation({
    mutationFn: createPaymentCheckout,
  });

  const { refetch: runTest } = useQuery({
    queryKey: ['test'],
    queryFn: () => fetch(`http://localhost:3003/test`).then(res => res.json()),
    enabled: false,
  });

  const formDisabled = sortedSubRaces.length === 0 || paymentMutation.isPending;
  const paymentState = searchParams.get('payment');

  const isEliteClassSelected = useMemo(() => {
    const selectedSubRace = sortedSubRaces.find(
      subRace => subRace.id === formState.startingClass
    );

    return selectedSubRace?.name.trim().toLowerCase() === 'elite';
  }, [formState.startingClass, sortedSubRaces]);

  useEffect(() => {
    if (isEliteClassSelected) {
      return;
    }

    setFormState(current => {
      if (!current.uciLicenseNumber) {
        return current;
      }

      return {
        ...current,
        uciLicenseNumber: '',
      };
    });

    setErrors(current => {
      if (!current.uciLicenseNumber) {
        return current;
      }

      return {
        ...current,
        uciLicenseNumber: undefined,
      };
    });
  }, [isEliteClassSelected]);

  const handleFieldChange = (
    field: keyof RegistrationFormState,
    value: string | boolean
  ) => {
    setFormState(current => ({
      ...current,
      [field]: value,
    }));

    setErrors(current => {
      if (!current[field]) {
        return current;
      }

      return {
        ...current,
        [field]: undefined,
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm(formState, isEliteClassSelected);
    setErrors(nextErrors);
    setSubmitError('');

    if (Object.keys(nextErrors).length > 0 || !race) {
      return;
    }

    const amount = Number(
      import.meta.env.VITE_REGISTRATION_AMOUNT_CENTS ?? 2000
    );
    const currency =
      (import.meta.env.VITE_REGISTRATION_CURRENCY as string) ?? 'EUR';

    if (!Number.isFinite(amount) || amount < 50 || !currency) {
      setSubmitError(
        'Payment configuration is missing. Set VITE_REGISTRATION_AMOUNT_CENTS (minimum 50) and VITE_REGISTRATION_CURRENCY.'
      );
      return;
    }

    const baseUrl = window.location.origin;
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
    const returnPath = `${basePath}/races/${race.id}/register`;

    try {
      const { checkoutUrl } = await paymentMutation.mutateAsync({
        amount,
        currency,
        subRaceId: formState.startingClass,
        participant: {
          fullName: `${formState.firstName} ${formState.lastName}`.trim(),
          email: formState.email,
          birthDate: formState.birthDate,
          gender: formState.gender,
          clubTeam: formState.clubTeam,
          nation: formState.nation,
          uciLicenseNumber: formState.uciLicenseNumber || undefined,
        },
        successUrl: `${baseUrl}${returnPath}?payment=success`,
        cancelUrl: `${baseUrl}${returnPath}?payment=cancelled`,
      });

      window.location.assign(checkoutUrl);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Could not start checkout.'
      );
    }
  };

  if (isLoading) {
    return (
      <section className="page-shell">
        <div className="surface-panel p-6 sm:p-8">
          <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
          <div className="mt-4 h-11 w-full max-w-3xl animate-pulse rounded bg-white/10" />
          <div className="mt-5 h-5 w-full max-w-2xl animate-pulse rounded bg-white/8" />
        </div>
        <div className="surface-panel p-6 sm:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-[1.5rem] bg-white/6"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || !race) {
    return (
      <section className="page-shell">
        <div className="surface-panel p-8 text-center sm:p-10">
          <span className="eyebrow">Registration</span>
          <h1 className="mt-5 font-heading text-4xl font-semibold text-(--text-primary-dark) sm:text-5xl">
            Race not found.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-(--text-secondary-dark)">
            We could not load this registration form. The race may be
            unpublished or the link is incorrect.
          </p>
          <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
            <Link className="cta-button w-full justify-center" to="/races">
              Back to races
            </Link>
            <Link className="ghost-button w-full justify-center" to="/contact">
              Contact organizers
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      {/* <div className="surface-panel overflow-hidden border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,90,54,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(0,212,255,0.16),transparent_34%),linear-gradient(145deg,rgba(18,25,35,0.96),rgba(11,15,20,0.98))] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <span className="eyebrow">Race registration</span>
        <h1 className="mt-5 max-w-4xl font-heading text-4xl font-semibold leading-[1.06] text-(--text-primary-dark) sm:text-5xl lg:text-6xl">
          {race.name}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-(--text-secondary-dark)">
          {formatRaceType(race.type)} in {race.location} on {formatRaceDate(race.raceDate)}. Complete the rider details below and continue to secure payment.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="filter-chip">{formatRaceDate(race.raceDate)}</span>
          <span className="filter-chip">{race.location}</span>
          <span className="filter-chip">{sortedSubRaces.length} starting classes</span>
        </div>
      </div> */}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.7fr]">
        <form
          className="surface-panel p-6 sm:p-8"
          noValidate
          onSubmit={handleSubmit}
        >
          {paymentState === 'success' ? (
            <div className="mb-6 rounded-3xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-100">
              Payment completed successfully. Your registration has been
              submitted.
            </div>
          ) : null}

          {paymentState === 'cancelled' ? (
            <div className="mb-6 rounded-3xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-100">
              Payment was cancelled. Review your details and try again when
              ready.
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-(--text-primary-dark)">
                Online registration for {race.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-(--text-secondary-dark)">
                Fields marked with * are required.
              </p>
            </div>
            <Link
              className="ghost-button hidden sm:inline-flex"
              to={`/races/${race.id}`}
            >
              Back to race
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-(--text-secondary-dark)">
              <span>First name *</span>
              <input
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-(--text-primary-dark) outline-none transition placeholder:text-(--text-secondary-dark) focus:border-[color:var(--accent-secondary)]"
                name="firstName"
                onChange={event =>
                  handleFieldChange('firstName', event.target.value)
                }
                placeholder="First name"
                type="text"
                value={formState.firstName}
              />
              {errors.firstName ? (
                <span className="text-sm text-[color:var(--accent-cta)]">
                  {errors.firstName}
                </span>
              ) : null}
            </label>

            <label className="grid gap-2 text-sm text-(--text-secondary-dark)">
              <span>Last name *</span>
              <input
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-(--text-primary-dark) outline-none transition placeholder:text-(--text-secondary-dark) focus:border-[color:var(--accent-secondary)]"
                name="lastName"
                onChange={event =>
                  handleFieldChange('lastName', event.target.value)
                }
                placeholder="Last name"
                type="text"
                value={formState.lastName}
              />
              {errors.lastName ? (
                <span className="text-sm text-[color:var(--accent-cta)]">
                  {errors.lastName}
                </span>
              ) : null}
            </label>

            <label className="grid gap-2 text-sm text-(--text-secondary-dark)">
              <span>Birth date *</span>
              <input
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-(--text-primary-dark) outline-none transition focus:border-[color:var(--accent-secondary)]"
                name="birthDate"
                onChange={event =>
                  handleFieldChange('birthDate', event.target.value)
                }
                type="date"
                value={formState.birthDate}
              />
              {errors.birthDate ? (
                <span className="text-sm text-[color:var(--accent-cta)]">
                  {errors.birthDate}
                </span>
              ) : null}
            </label>

            <label className="grid gap-2 text-sm text-(--text-secondary-dark)">
              <span>Gender *</span>
              <select
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-(--text-primary-dark) outline-none transition focus:border-[color:var(--accent-secondary)]"
                name="gender"
                onChange={event =>
                  handleFieldChange('gender', event.target.value)
                }
                value={formState.gender}
              >
                <option value="">Please select...</option>
                {genderOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.gender ? (
                <span className="text-sm text-[color:var(--accent-cta)]">
                  {errors.gender}
                </span>
              ) : null}
            </label>

            <label className="grid gap-2 text-sm text-(--text-secondary-dark) md:col-span-2">
              <span>Club / Team</span>
              <input
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-(--text-primary-dark) outline-none transition placeholder:text-(--text-secondary-dark) focus:border-[color:var(--accent-secondary)]"
                name="clubTeam"
                onChange={event =>
                  handleFieldChange('clubTeam', event.target.value)
                }
                placeholder="Club or team name"
                type="text"
                value={formState.clubTeam}
              />
            </label>

            <label className="grid gap-2 text-sm text-(--text-secondary-dark)">
              <span>Nation *</span>
              <input
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-(--text-primary-dark) outline-none transition placeholder:text-(--text-secondary-dark) focus:border-[color:var(--accent-secondary)]"
                name="nation"
                onChange={event =>
                  handleFieldChange('nation', event.target.value)
                }
                placeholder="Nation"
                type="text"
                value={formState.nation}
              />
              {errors.nation ? (
                <span className="text-sm text-[color:var(--accent-cta)]">
                  {errors.nation}
                </span>
              ) : null}
            </label>

            <label className="grid gap-2 text-sm text-(--text-secondary-dark)">
              <span>Starting class *</span>
              <select
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-(--text-primary-dark) outline-none transition focus:border-[color:var(--accent-secondary)] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={sortedSubRaces.length === 0}
                name="startingClass"
                onChange={event =>
                  handleFieldChange('startingClass', event.target.value)
                }
                value={formState.startingClass}
              >
                {sortedSubRaces.length === 0 ? (
                  <option value="">No starting classes available</option>
                ) : null}
                {sortedSubRaces.map(subRace => (
                  <option key={subRace.id} value={subRace.id}>
                    {subRace.name}
                  </option>
                ))}
              </select>
              {errors.startingClass ? (
                <span className="text-sm text-[color:var(--accent-cta)]">
                  {errors.startingClass}
                </span>
              ) : null}
            </label>

            {isEliteClassSelected ? (
              <label className="grid gap-2 text-sm text-(--text-secondary-dark) md:col-span-2">
                <span>UCI License Number *</span>
                <input
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-(--text-primary-dark) outline-none transition placeholder:text-(--text-secondary-dark) focus:border-[color:var(--accent-secondary)]"
                  name="uciLicenseNumber"
                  onChange={event =>
                    handleFieldChange('uciLicenseNumber', event.target.value)
                  }
                  placeholder="Enter your UCI license number"
                  type="text"
                  value={formState.uciLicenseNumber}
                />
                {errors.uciLicenseNumber ? (
                  <span className="text-sm text-[color:var(--accent-cta)]">
                    {errors.uciLicenseNumber}
                  </span>
                ) : null}
              </label>
            ) : null}

            <label className="grid gap-2 text-sm text-(--text-secondary-dark) md:col-span-2">
              <span>Email *</span>
              <input
                autoComplete="email"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-(--text-primary-dark) outline-none transition placeholder:text-(--text-secondary-dark) focus:border-[color:var(--accent-secondary)]"
                name="email"
                onChange={event =>
                  handleFieldChange('email', event.target.value)
                }
                placeholder="name@example.com"
                type="email"
                value={formState.email}
              />
              {errors.email ? (
                <span className="text-sm text-[color:var(--accent-cta)]">
                  {errors.email}
                </span>
              ) : null}
            </label>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/4 p-5">
            <h3 className="font-heading text-xl font-semibold text-(--text-primary-dark)">
              Privacy Policy & Disclaimer
            </h3>
            <p className="mt-3 text-sm leading-6 text-(--text-secondary-dark)">
              You must accept the privacy policy before continuing to the Stripe
              payment page.
            </p>
            <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-(--text-secondary-dark)">
              <input
                checked={formState.privacyAccepted}
                className="mt-1 h-4 w-4 rounded border border-white/10 bg-white/5"
                name="privacyAccepted"
                onChange={event =>
                  handleFieldChange('privacyAccepted', event.target.checked)
                }
                type="checkbox"
              />
              <span>
                I agree to the{' '}
                <Link
                  className="text-(--accent-secondary) underline decoration-transparent transition hover:decoration-current"
                  to="/privacy"
                >
                  privacy policy
                </Link>
                . *
              </span>
            </label>
            {errors.privacyAccepted ? (
              <p className="mt-2 text-sm text-[color:var(--accent-cta)]">
                {errors.privacyAccepted}
              </p>
            ) : null}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              className="cta-button w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
              disabled={formDisabled}
              type="submit"
            >
              {paymentMutation.isPending
                ? 'Redirecting to checkout...'
                : 'Continue to payment'}
            </button>
            <button
              className="ghost-button w-full justify-center"
              onClick={() => runTest()}
              type="button"
            >
              Test
            </button>
            <Link
              className="ghost-button w-full justify-center"
              to={`/races/${race.id}`}
            >
              Cancel
            </Link>
          </div>

          {submitError ? (
            <p className="mt-4 text-sm leading-6 text-[color:var(--accent-cta)]">
              {submitError}
            </p>
          ) : null}

          {sortedSubRaces.length === 0 ? (
            <p className="mt-4 text-sm leading-6 text-(--text-secondary-dark)">
              Registration is currently unavailable for this race. Check back
              later or contact the organizers directly.
            </p>
          ) : null}
        </form>

        <aside className="grid gap-4 self-start">
          <div className="surface-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--accent-secondary)">
              Available classes
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {sortedSubRaces.length > 0 ? (
                sortedSubRaces.map(subRace => (
                  <span key={subRace.id} className="filter-chip">
                    {subRace.name}
                  </span>
                ))
              ) : (
                <p className="text-sm text-(--text-secondary-dark)">
                  No starting classes are configured yet.
                </p>
              )}
            </div>
          </div>

          <div className="surface-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--accent-secondary)">
              Need help?
            </p>
            <p className="mt-3 text-sm leading-6 text-(--text-secondary-dark)">
              If your class is missing or the payment link is not available, use
              the organizer contact page instead.
            </p>
            <Link
              className="ghost-button mt-5 w-full justify-center"
              to="/contact"
            >
              Contact organizers
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
