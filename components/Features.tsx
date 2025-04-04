import { LayoutDashboard, MessageCircle, Boxes, Rocket } from "lucide-react";

const features = [
  {
    title: "One Dashboard to Rule It All",
    description: "Track orders, inventory, shipping — all in one clean dashboard.",
    icon: <LayoutDashboard className="text-indigo-500" />,
    color: "from-indigo-100 to-indigo-50",
  },
  {
    title: "Real-Time WhatsApp Sync",
    description: "Get instant order updates and customer pings via WhatsApp.",
    icon: <MessageCircle className="text-green-500" />,
    color: "from-green-100 to-green-50",
  },
  {
    title: "No More Stock Surprises",
    description: "Smart inventory alerts before you're out of stock.",
    icon: <Boxes className="text-orange-500" />,
    color: "from-orange-100 to-orange-50",
  },
  {
    title: "Fast Setup, No BS",
    description: "You're live in under 5 minutes. No tech headaches.",
    icon: <Rocket className="text-pink-500" />,
    color: "from-pink-100 to-pink-50",
  },
];

const Features = () => {
  return (
    <section className="py-16 px-6 md:px-20 ">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 font-clash">
        What Makes ShipTrack Different?
      </h2>
      <p className="text-center text-muted-foreground max-w-xl mx-auto mb-10">
        We obsess over your shipping experience so you don’t have to. Fast, reliable, and smart — right out of the box.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feat, i) => (
          <div
            key={i}
            className={`rounded-xl p-6 bg-gradient-to-br ${feat.color} shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-gray-300 dark:hover:border-neutral-700`}
          >
            <div className="flex items-start gap-4">
              <div className="text-xl">{feat.icon}</div>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-black">{feat.title}</h3>
                <p className="text-sm text-muted-foreground">{feat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
