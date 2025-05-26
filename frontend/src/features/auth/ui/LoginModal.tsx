import Link from "next/link"
import Image from "next/image"

export default function LoginModal() {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center bg-[rgba(0,0,0,0.5)] justify-center">
      <div className="flex items-center justify-center bg-black text-white text-base font-semibold px-5 py-2.5 rounded-md cursor-pointer transition-colors duration-300 hover:bg-gray-800">
          <Link 
            className="flex items-center"
            href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI}`} 
            title="GitHub 로그인"
          >
            <Image src="/github-mark-white.svg" alt="GitHub Icon" width={24} height={24} />
            Sign in with GitHub
          </Link>
      </div>
    </div>
  );
}