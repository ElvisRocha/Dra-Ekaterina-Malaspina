import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Microscope, FlaskConical, Instagram } from 'lucide-react';

const DOCTOR_PHOTO_URL =
  'https://res.cloudinary.com/dcvipikha/image/upload/f_auto,q_auto/v1771955331/Dr._Emmanuel_Gonz%C3%A1lez_Solano_fyyu9q.jpg';
const DOCTOR_INSTAGRAM = 'https://www.instagram.com/patologiahyg';
const DOCTOR_NAME = 'Dr. Emmanuel González Solano';

const PathologyLabSection = () => {
  const { t } = useLanguage();

  return (
    <section
      id="laboratorio-patologia"
      className="py-20 md:py-28 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(160deg, hsl(340 40% 96%) 0%, hsl(340 30% 93%) 50%, hsl(20 50% 97%) 100%)',
      }}
    >
      {/* Decorative blurred circles */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[hsl(332_65%_39%/0.07)] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[hsl(8_72%_58%/0.06)] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-white/70 border border-[hsl(332_65%_39%/0.18)] rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <Microscope className="w-4 h-4 text-[hsl(332,65%,39%)]" aria-hidden="true" />
            <span className="text-xs font-medium text-[hsl(332,65%,39%)] tracking-wide uppercase">
              {t('pathology.trustLabel')}
            </span>
          </div>

          {/* Opening question */}
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-[hsl(14,28%,18%)] max-w-3xl mx-auto leading-snug mb-4">
            {t('pathology.question')}
          </h2>

          {/* Gradient underline */}
          <div className="w-20 h-1 bg-gradient-to-r from-[hsl(8,72%,58%)] via-[hsl(329,69%,46%)] to-[hsl(332,65%,39%)] mx-auto rounded-full" />
        </motion.div>

        {/* Two-column content */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* Left column — message */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-5"
          >
            {/* Intro highlight */}
            <p className="font-display text-xl md:text-2xl text-[hsl(332,65%,39%)] font-medium italic">
              {t('pathology.intro')}
            </p>

            {/* Main message */}
            <p className="text-[hsl(14,28%,24%)] leading-relaxed text-base md:text-[0.97rem]">
              {t('pathology.message')}
            </p>

            {/* Collaboration statement */}
            <div className="flex items-start gap-3 bg-white/60 border border-[hsl(332_65%_39%/0.15)] rounded-2xl px-5 py-4 shadow-sm">
              <FlaskConical
                className="w-5 h-5 text-[hsl(329,69%,46%)] mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <p className="text-[hsl(14,28%,22%)] text-sm leading-relaxed font-medium">
                {t('pathology.collaboration')}
              </p>
            </div>
          </motion.div>

          {/* Right column — doctor card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center"
          >
            <div className="bg-white/75 backdrop-blur-sm border border-[hsl(332_65%_39%/0.12)] rounded-3xl shadow-[0_8px_30px_-8px_hsl(332_65%_39%/0.18)] px-8 py-8 w-full max-w-sm text-center">
              {/* Circular photo */}
              <div className="relative inline-block mb-5">
                <div
                  className="w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-[0_4px_20px_-4px_hsl(332_65%_39%/0.3)] mx-auto"
                  style={{
                    background:
                      'linear-gradient(135deg, hsl(340 40% 96%), hsl(332 65% 39% / 0.1))',
                  }}
                >
                  <img
                    src={DOCTOR_PHOTO_URL}
                    alt={DOCTOR_NAME}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                {/* Gradient ring accent */}
                <span
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background:
                      'conic-gradient(from 180deg, hsl(8,72%,58%), hsl(329,69%,46%), hsl(332,65%,39%), hsl(8,72%,58%))',
                    borderRadius: '9999px',
                    padding: '2px',
                    WebkitMask:
                      'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    zIndex: 1,
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Doctor name */}
              <h3 className="font-display text-xl md:text-2xl text-[hsl(14,28%,18%)] font-semibold mb-1">
                {DOCTOR_NAME}
              </h3>

              {/* Specialty */}
              <p className="text-[hsl(332,65%,39%)] text-xs font-medium tracking-wide uppercase mb-4 leading-relaxed px-2">
                {t('pathology.doctor.specialty')}
              </p>

              {/* Divider */}
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-[hsl(332_65%_39%/0.3)] to-transparent mx-auto mb-4" />

              {/* Bio */}
              <p className="text-[hsl(14,28%,30%)] text-xs leading-relaxed mb-5 text-left">
                {t('pathology.doctor.bio')}
              </p>

              {/* Instagram link */}
              <a
                href={DOCTOR_INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('pathology.instagramLabel')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[hsl(8,72%,58%)] to-[hsl(332,65%,39%)] text-white text-xs font-medium px-4 py-2 rounded-full shadow-sm hover:shadow-md hover:brightness-105 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(332,65%,39%)] focus-visible:ring-offset-2"
              >
                <Instagram className="w-3.5 h-3.5" aria-hidden="true" />
                @patologiahyg
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PathologyLabSection;
