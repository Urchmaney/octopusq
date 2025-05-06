import { EyeOffIcon, EyeIcon } from "lucide-react"
import { useState } from "react"
import { CardContent, Input } from "../../components"
import { Link } from "react-router"

export function Register() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <CardContent className="space-y-6 pb-6">
      <form className="space-y-4">
        <div>
          <Input
            name="name"
            type="text"
            placeholder="Full name"
            className="border-0 border-b border-gray-200 bg-transparent px-0 py-2 focus-visible:border-[#1a4b53] focus-visible:ring-0"
          />
        </div>

        <div>
          <Input
            name="email"
            type="email"
            placeholder="Email address"
            className="border-0 border-b border-gray-200 bg-transparent px-0 py-2 focus-visible:border-[#1a4b53] focus-visible:ring-0"
          />
        </div>

        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create password"
            className="border-0 border-b border-gray-200 bg-transparent px-0 py-2 focus-visible:border-[#1a4b53] focus-visible:ring-0"
          />
          <button
            type="button"
            className="absolute right-0 top-2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </button>
        </div>

        <button type="submit" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 mt-6 w-full bg-[#1a4b53] py-6 text-white hover:bg-[#15393f]">
          CREATE ACCOUNT
        </button>
      </form>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account yet?{" "}
          <Link to={"/auth/login"} className="font-medium text-[#1a4b53] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </CardContent>
  )

}