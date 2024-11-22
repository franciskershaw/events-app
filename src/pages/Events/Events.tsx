import useAuth from "@/hooks/auth/useAuth";

const Events = () => {
  const { logout } = useAuth();
  return (
    <div>
      Events!!!!!
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Events;
