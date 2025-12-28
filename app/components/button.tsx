type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const Button = ({ children, className = "", onClick }: ButtonProps) => {
  return (
    
        <button className={`w-full !p-3 border border-black uppercase cursor-pointer transition-all duration-500 ease-in-out 
            hover: hover:bg-black hover:text-white hover:scale-105
        ${className}`}>{children}</button> 
);
}
 
export default Button;