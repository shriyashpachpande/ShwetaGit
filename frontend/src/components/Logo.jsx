import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link
      to="/"
      onClick={() => {
        scrollTo(0, 0);
      }}
      className="flex items-center max-md:flex-1"
    >
      {/* Agar text hi logo hai */}
      <h1
        className="
          text-xl         /* Mobile ke liye */
          sm:text-2xl     /* Small screens (tablet portrait) */
          md:text-3xl     /* Medium (tablet landscape) */
          lg:text-4xl     /* Large (desktop) */
          font-bold
          text-black
          tracking-wide
          whitespace-nowrap
        "
      >
        ClauseSense
      </h1>

      {/* Agar future me image logo add karna ho to ye use kar sakte ho */}
      {/* <img
        src="/logo.png"
        alt="ClauseSense Logo"
        className="w-24 h-auto md:w-32 lg:w-40"
      /> */}
    </Link>
  );
};

export default Logo;
