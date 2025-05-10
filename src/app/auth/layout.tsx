import { Link, Outlet } from "react-router"
import { Card, CardHeader } from "../../components"
import journeyImg from "../../assets/journey.jpg";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left side with illustration */}
      <div className="relative hidden w-1/2 bg-[#236983] lg:block">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-[400px] w-[600px]">
            <img
              src={journeyImg}
              alt="Illustration of a person at a doorway"
              width={"100%"}
              height={"100%"}
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="flex w-full flex-col items-center justify-center bg-[#ffc145] px-4 lg:w-1/2">
        <Card className="w-full max-w-md border-none shadow-lg">
          <CardHeader className="pb-2 pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium uppercase text-[#ffc145]">ALREADY MEMBERS</p>
              <Link to={"/auth/help"} className="text-sm text-gray-400 hover:text-gray-600">
                Need help?
              </Link>
            </div>
          </CardHeader>
          <Outlet />
        </Card>
      </div>
    </div>
  )
}
