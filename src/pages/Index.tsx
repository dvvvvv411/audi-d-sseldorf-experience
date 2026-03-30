import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    window.location.replace("https://audi.de");
  }, []);

  return null;
};

export default Index;
