const List = () => {
    const Cars = ["Tesla",
        "Bmw",
        "Mercedes",
        "Nissan",
        "Porsche"];
    return (
        <>
        <label>
            best cars brand
            </label>
        <ul>
            {Cars .length ? (
             Cars.map((car)=>(
                 <li
                 key =
                 {car}>{car}
                 </li>
            ))
        ) : (
            <div>there is no item...</div>
        )
            </ul>
        </>
    );
};

export default List