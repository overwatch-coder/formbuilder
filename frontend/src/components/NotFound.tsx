const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="mb-4 text-4xl font-bold">404 - Page Not Found</h1>
      <img className="object-cover mb-4" src="https://http.cat/404" alt="404" />
      <p className="text-lg">The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
