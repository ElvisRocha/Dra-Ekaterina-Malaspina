export interface Testimonial {
  id: number;
  nameEs: string;
  nameEn: string;
  contextEs: string;
  contextEn: string;
  rating: number;
  textEs: string;
  textEn: string;
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    nameEs: 'María González',
    nameEn: 'María González',
    contextEs: '34 años · Madre primeriza',
    contextEn: '34 years old · First-time mother',
    rating: 5,
    textEs:
      'La Dra. Ekaterina me acompañó durante todo mi embarazo con dedicación y calidez. Los ultrasonidos 4D fueron mágicos. Una doctora excepcional que realmente se preocupa por sus pacientes.',
    textEn:
      'Dr. Ekaterina accompanied me throughout my pregnancy with dedication and warmth. The 4D ultrasounds were magical. An exceptional doctor who truly cares about her patients.',
    date: '2025-01',
  },
  {
    id: 2,
    nameEs: 'Ana Sofía Ramírez',
    nameEn: 'Ana Sofía Ramírez',
    contextEs: '28 años · Control ginecológico',
    contextEn: '28 years old · Gynecological checkup',
    rating: 5,
    textEs:
      'La tecnología de última generación y explicaciones detalladas me dieron tranquilidad absoluta. Me siento en las mejores manos para cuidar mi salud femenina.',
    textEn:
      'The cutting-edge technology and detailed explanations gave me absolute peace of mind. I feel I\'m in the best hands to take care of my women\'s health.',
    date: '2024-12',
  },
  {
    id: 3,
    nameEs: 'Carolina Mora',
    nameEn: 'Carolina Mora',
    contextEs: '41 años · Segunda maternidad',
    contextEn: '41 years old · Second pregnancy',
    rating: 5,
    textEs:
      'Una ginecóloga que me hizo sentir cómoda y escuchada. Su experiencia, empatía y las instalaciones modernas son insuperables. La recomiendo con los ojos cerrados.',
    textEn:
      'A gynecologist who made me feel comfortable and heard. Her experience, empathy, and the modern facilities are unmatched. I recommend her wholeheartedly.',
    date: '2024-11',
  },
];
