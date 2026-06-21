import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
    
    return (
        <Link to={`/books/${book._id}`} className="block group">
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                <div className="relative">
                    <img src={book.coverImage} alt={book.title} className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" />
                    {book.isCheckedOut && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Unavailable
                        </span>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="font-semibold truncate">{book.title}</h3>
                    <p className="text-sm text-gray-500">{book.category}</p>
                    <p className="text-secondary font-bold mt-2">${book.deliveryFee} delivery</p>
                </div>
            </div>
        </Link>
    );
};

export default BookCard;