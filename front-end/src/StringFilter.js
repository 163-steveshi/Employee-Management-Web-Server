//an ag-grid filter logical object
//it only allows contains, notContains and equals
// There is a Text Formatter, so if you search for 'o' it will find 'ö'. You can try this by searching the string 'Bjo'.
// The filter has a debounce of 200ms (debounceMs = 200).
// Only one Filter Condition is allowed (maxNumConditions = 1)
//give credit to the Ag-grid documentation
const StringFilterParams = {
  filterOptions: ["contains", "notContains", "equals"],
  textFormatter: (r) => {
    if (r == null) return null;
    return r
      .toLowerCase()
      .replace(/[àáâãäå]/g, "a")
      .replace(/æ/g, "ae")
      .replace(/ç/g, "c")
      .replace(/[èéêë]/g, "e")
      .replace(/[ìíîï]/g, "i")
      .replace(/ñ/g, "n")
      .replace(/[òóôõö]/g, "o")
      .replace(/œ/g, "oe")
      .replace(/[ùúûü]/g, "u")
      .replace(/[ýÿ]/g, "y");
  },
  debounceMs: 200,
  maxNumConditions: 1,
};
export default StringFilterParams;
