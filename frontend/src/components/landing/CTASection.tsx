import { useNavigate } from "react-router-dom";
import Button from "../Button";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="blood-gradient py-20 px-8 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-4xl font-black text-white mb-4">
          Ready to make a difference?
        </h2>
        <p className="font-body text-white/70 text-lg mb-8">
          Join the network. Register as a donor or onboard your hospital today.
        </p>
        <Button variant="white" size="lg" onClick={() => navigate("/register")}>
          Get Started — It's Free
        </Button>
      </div>
    </section>
  );
}