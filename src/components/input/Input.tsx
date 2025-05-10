import { RefObject, useState } from "react";
import { cn } from "../../utils"
import { EyeIcon, EyeOffIcon } from "lucide-react";


export function Input(props: React.ComponentProps<"input"> & { ref?: RefObject<HTMLInputElement> }) {
  const { className, ref, type, ...others } = props;

  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...others}
    />
  )
}

Input.displayName = "Input"

export function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
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
  )
}

