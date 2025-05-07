import { useState } from "react"
import { CardContent, Input } from "../../components"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Link } from "react-router"

export function Login() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <CardContent className="space-y-6 pb-6">
      <form className="space-y-4">
        <div>
          <Input
            name="email"
            type="text"
            placeholder="Username or email"
            defaultValue="Mahisa Dyan Diptya"
            className="border-0 border-b border-gray-200 bg-transparent px-0 py-2 focus-visible:border-[#1a4b53] focus-visible:ring-0"
          />
        </div>

        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
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
          SIGN IN
        </button>
      </form>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account yet?{" "}
          <Link to={"/auth/register"} className="font-medium text-[#1a4b53] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </CardContent>
  )
}
