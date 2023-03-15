import { useMatchesSearch } from "../../hooks/useMatchesSearch";
import "./Matches.css";

const Matches = (): JSX.Element => {
  const { loading, error, matches, hasMore } = useMatchesSearch();
  return <div>MATCHES</div>;
};

export default Matches;
