import "./genre.css";

import { useNavigate } from "react-router-dom";
import { useGetGenreQuery } from "@/query/genre";
import { GenreDto } from "@/types/ver2/genre.type";

export default function Genre() {
  const navigate = useNavigate();
  const { data } = useGetGenreQuery({ limit: 60, page: 1 });

  const renderGenre = () => {
    return data?.data?.data.map((genre: GenreDto, index: number) => (
      <div
        key={genre.id}
        className={`genre-box color-${index % 10}`}
        onClick={() => navigate(`/genre/${genre.id}`)}
      >
        {genre.nameGenre}
      </div>
    ));
  };

  return (
    <div className="genre-page">
      <h1 className="genre-title">Genres All</h1>
      <div className="genre-grid">{renderGenre()}</div>
    </div>
  );
}
