"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Button from "./ui/Button";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="leaf">
            🌿
          </span>
          <span className="text-xl font-bold text-eco-700">EcoTrack</span>
        </Link>

        <div className="hidden items-center gap-6 sm:flex">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/log"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Log Activity
          </Link>
          <Link
            href="/dashboard/history"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            History
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {session?.user && (
            <>
              <span className="hidden text-sm text-gray-600 sm:block">
                {session.user.name || session.user.email}
              </span>
              <Button
                variant="ghost"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
