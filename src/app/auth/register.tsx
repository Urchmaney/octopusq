
import { CardContent, Input, PasswordInput } from "../../components"
import { Link } from "react-router"
import { useFetcherSumbit } from "../../hooks/useFetcherSubmit";

export function Register() {
  const { fetcher, errors, busy } = useFetcherSumbit();

  return (
    <CardContent className="space-y-6 pb-6">
      {errors?.length > 0 &&
        <ul className="mt-3 list-disc px-2">
          {
            errors?.map((x, i) => (
              <li key={`register_error_${i}`} className="text-red-500 text-sm">{x}</li>
            ))
          }
        </ul>}
      <fetcher.Form className="space-y-4" action="/auth/register" method="post">
        <div>
          <Input
            name="full_name"
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

        <div>
          <PasswordInput />
        </div>

        <button type="submit" className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 mt-6 w-full bg-[#1a4b53] py-6 text-white hover:bg-[#15393f]">
          { busy ? "CREATING..." : "CREATE ACCOUNT" }
        </button>
      </fetcher.Form>
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
