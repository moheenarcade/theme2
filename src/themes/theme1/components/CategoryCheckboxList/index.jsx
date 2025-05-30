import React from "react";

const CategoryCheckboxList = React.memo(function CategoryCheckboxList({
  categories,
  selectedCategories,
  onChange,
  isArabic
}) {
  return (
    <ul className="pl-2 text-[14px]">
      {categories.map((cat) => (
        <li key={cat.id} className="form-group py-3 border-b-[1px] border-b-gray-300">
          <input
            type="checkbox"
            id={`cat-${cat.id}`}
            checked={selectedCategories.includes(cat.name)}
            onChange={() => onChange(cat.name)}
          />
          <label htmlFor={`cat-${cat.id}`}>{isArabic ? cat.name_ar : cat.name}</label>
        </li>
      ))}
    </ul>
  );
});

export default React.memo(CategoryCheckboxList);

