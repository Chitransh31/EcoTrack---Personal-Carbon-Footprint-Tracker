import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Button from "@/components/ui/Button";

export default async function LandingPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="leaf">
              🌿
            </span>
            <span className="text-xl font-bold text-eco-700">EcoTrack</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Track Your{" "}
            <span className="text-eco-600">Carbon Footprint</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600">
            Log your daily transport, energy, and food activities. Visualize
            your CO2 emissions with interactive charts and make more sustainable
            choices.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/register">
              <Button className="px-8 py-3 text-base">
                Start Tracking Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" className="px-8 py-3 text-base">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-3 text-3xl">🚗</div>
              <h3 className="font-semibold text-gray-900">Transport</h3>
              <p className="mt-1 text-sm text-gray-600">
                Car, bus, train, flight, bike, or walk — track them all.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-3 text-3xl">⚡</div>
              <h3 className="font-semibold text-gray-900">Energy</h3>
              <p className="mt-1 text-sm text-gray-600">
                Electricity, gas, and heating — monitor your home energy use.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-3 text-3xl">🍽️</div>
              <h3 className="font-semibold text-gray-900">Food</h3>
              <p className="mt-1 text-sm text-gray-600">
                Meat, dairy, vegetables, or vegan — see the impact of your
                diet.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500">
          <p>EcoTrack - Personal Carbon Footprint Tracker</p>
          <p className="mt-1">
            Emission factors sourced from DEFRA, EPA, and IPCC.
          </p>
        </div>
      </footer>
    </div>
  );
}
