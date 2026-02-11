import { ArrowLeft, Heart, AlertCircle, BookOpen, Users } from "lucide-react";

interface KeyPointsProps {
  onBack: () => void;
}

const KeyPoints = ({ onBack }: KeyPointsProps) => {
  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back to all milestones</span>
      </button>

      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
        ✨ Key Points to Remember
      </h1>

      <div className="space-y-6">
        <div className="bg-pastel-mint/50 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center flex-shrink-0">
              <Heart className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">Every Child is Unique</h3>
              <p className="text-foreground/90">
                Children develop at their own pace. Milestones are guidelines, not strict deadlines. 
                Some children reach milestones earlier, while others take more time.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-pastel-lavender/50 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">Act Early on Concerns</h3>
              <p className="text-foreground/90">
                If you're concerned about your child's development, don't wait. Talk to your 
                child's doctor right away. Early intervention can make a significant difference.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-pastel-peach/50 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">Track Progress Regularly</h3>
              <p className="text-foreground/90">
                Use milestone checklists at each well-child visit. Share your observations 
                with your child's healthcare provider to ensure the best care.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-pastel-sky/50 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center flex-shrink-0">
              <Users className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">You Know Your Child Best</h3>
              <p className="text-foreground/90">
                As a parent, you already have what it takes to help your child learn and grow. 
                Trust your instincts and never hesitate to ask questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyPoints;
