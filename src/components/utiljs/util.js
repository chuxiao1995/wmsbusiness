const comjs = {

}

/**
 * 处理表格索引累加
 */
comjs.indexMethod = function (index, currentPage, currentPageSize) {
    return (currentPage - 1) * currentPageSize + index + 1;
}

export default comjs;