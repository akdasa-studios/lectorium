
import { BookOpen, FileText, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: <BookOpen className="h-10 w-10 text-sadu-purple" />,
    title: "A.C. Bhaktivedanta Swami",
    description: "Get all lectures from A.C. Bhaktivedanta Swami Prabhupada, a top Vedic scholar, packed with straight-up wisdom.",
    color: "from-sadu-purple/20 to-sadu-purple/5"
  },
  {
    icon: <FileText className="h-10 w-10 text-sadu-gold" />,
    title: "Transcript Access",
    description: "Search transcripts fast, save key points, and share insights with others, no hassle.",
    color: "from-sadu-gold/20 to-sadu-light-gold/10"
  },
  {
    icon: <CheckCircle className="h-10 w-10 text-sadu-deep-purple" />,
    title: "Sadhana Tracker",
    description: "Keep tabs on your spiritual progress and stay locked into Vedic practices daily.",
    color: "from-sadu-deep-purple/20 to-sadu-deep-purple/5"
  },
];

const FeatureSection = () => {
  return (
    <section id="features" className="lotus-pattern section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="inline-block text-3xl md:text-4xl font-serif font-bold mb-4 heading-gradient">
            Timeless Wisdom for Modern Seekers
          </h2>
          <p className="max-w-2xl mx-auto text-gray-700">
            Sadu brings the profound insights of ancient Vedic knowledge into your daily life through an intuitive, beautiful interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              <Card className="h-full border-none card-gradient">
                <CardHeader>
                  <div className={cn("w-16 h-16 mb-4 rounded-xl flex items-center justify-center bg-gradient-to-br", feature.color)}>
                    {feature.icon}
                  </div>
                  <CardTitle className="font-serif text-xl text-sadu-dark-purple">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-700">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
