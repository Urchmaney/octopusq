import { CardContent, Input, PasswordInput } from "../../components"
import { Link } from "react-router"
import { useFetcherSumbit } from "../../hooks/useFetcherSubmit";

export function Login() {
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
      <fetcher.Form className="space-y-4" action="/auth/login" method="post">
        <div>
          <Input
            name="email"
            type="email"
            placeholder="Username or email"
            className="border-0 border-b border-gray-200 bg-transparent px-0 py-2 focus-visible:border-[#1a4b53] focus-visible:ring-0"
          />
        </div>

        <div>
          <PasswordInput />
        </div>

        <button type="submit" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary-foreground h-10 px-4 mt-6 w-full bg-[#1a4b53] py-6 text-white hover:bg-[#15393f]">
          {busy ? "SIGNING IN..." : "SIGN IN"}
        </button>
      </fetcher.Form >
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
