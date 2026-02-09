import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Instagram, Award, Star, Quote } from 'lucide-react';
import { testimonials } from '@/data/testimonials';
import type { Testimonial } from '@/data/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  language: 'es' | 'en';
}

const TestimonialCard = ({ testimonial, index, language }: TestimonialCardProps) => {
  const name = language === 'es' ? testimonial.nameEs : testimonial.nameEn;
  const context = language === 'es' ? testimonial.contextEs : testimonial.contextEn;
  const text = language === 'es' ? testimonial.textEs : testimonial.textEn;
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className="bg-card rounded-2xl p-6 border border-border/50 hover:shadow-[var(--shadow-card)] transition-shadow duration-300 flex flex-col"
    >
      {/* Quote icon */}
      <Quote className="w-8 h-8 text-coral/30 mb-3 shrink-0" />

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < testimonial.rating
                ? 'fill-coral text-coral'
                : 'fill-muted text-muted'
            }`}
          />
        ))}
      </div>

      {/* Testimonial text */}
      <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
        &ldquo;{text}&rdquo;
      </p>

      {/* Author info */}
      <div className="flex items-center gap-3 pt-4 border-t border-border/50">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral/20 to-magenta/20 flex items-center justify-center shrink-0">
          <span className="text-primary font-semibold text-sm">
            {initials}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">{name}</p>
          <p className="text-xs text-muted-foreground truncate">{context}</p>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-24 bg-soft-gradient relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-0 w-40 h-40 bg-coral/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-40 h-40 bg-magenta/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-6">
            {t('testimonials.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-coral via-fuchsia to-magenta mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-12">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card-elevated text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="w-8 h-8 text-coral" />
              <span className="font-display text-xl text-foreground">
                {t('testimonials.badge')}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-coral text-coral" />
              ))}
            </div>
          </motion.div>

          {/* Testimonial Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                index={index}
                language={language}
              />
            ))}
          </div>

          {/* Instagram CTA */}
          <motion.a
            href="https://instagram.com/dra_ekaterina_gine"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="block card-elevated group hover:border-primary/20 transition-colors"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coral to-magenta flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Instagram className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl text-foreground mb-1">
                  {t('testimonials.follow')}
                </h3>
                <p className="text-primary font-medium">@dra_ekaterina_gine</p>
              </div>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
