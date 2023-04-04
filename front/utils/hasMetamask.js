// savoir si metamask est installé
const hasMetamask = () => {
  return (
    typeof window !== "undefined" && typeof window.ethereum !== "undefined"
  );
};

export { hasMetamask };
