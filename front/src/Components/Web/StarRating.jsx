const StarRating = ({ rating, size, dark = false }) => {
  const totalStars = 5;

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => (
        <svg
          key={index}
          className={`h-${size} w-${size} ${
            index < rating
              ? dark
                ? "text-white"
                : "text-grey"
              : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
