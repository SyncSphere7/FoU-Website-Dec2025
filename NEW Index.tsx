import { ArrowRight, Heart, Users, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-image.jpg";
import educationImage from "@/assets/education-impact.jpg";
import waterImage from "@/assets/water-project.jpg";
import agricultureImage from "@/assets/agriculture-project.jpg";

const Index = () => {
  const impactStats = [
    { icon: Users, value: "50,000+", label: "Lives Impacted" },
    { icon: Target, value: "120+", label: "Active Projects" },
    { icon: Heart, value: "1,500+", label: "Volunteers" },
    { icon: TrendingUp, value: "85%", label: "Success Rate" },
  ];

  const projects = [
    {
      title: "Education for All",
      description: "Building schools and providing quality education to underserved communities.",
      image: educationImage,
    },
    {
      title: "Clean Water Access",
      description: "Installing wells and water systems to provide safe drinking water.",
      image: waterImage,
    },
    {
      title: "Sustainable Agriculture",
      description: "Empowering farmers with modern techniques and resources.",
      image: agricultureImage,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            One Love,{" "}
            <span className="text-gradient block mt-2">For The Country</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Building sustainable communities across Uganda through education, healthcare, and
            empowerment initiatives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8"
            >
              Support Our Cause
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 text-lg px-8"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <Card key={index} className="text-center hover-lift border-none shadow-lg">
                <CardContent className="pt-6">
                  <stat.icon className="h-12 w-12 mx-auto mb-4 text-accent" />
                  <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            To empower Ugandan communities through sustainable development initiatives that focus on
            education, healthcare, clean water, and economic opportunity. We believe in creating
            lasting change by working alongside local communities to build a brighter future for all.
          </p>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Impact Areas</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Creating meaningful change across multiple sectors to build stronger communities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="overflow-hidden hover-lift border-none shadow-lg">
                <div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${project.image})` }}
                />
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <Button variant="link" className="p-0 h-auto font-semibold text-accent">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Us in Making a Difference</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Your support can transform lives. Whether through donations, volunteering, or spreading
            awareness, every action counts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg px-8"
            >
              Donate Today
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8"
            >
              Become a Volunteer
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
