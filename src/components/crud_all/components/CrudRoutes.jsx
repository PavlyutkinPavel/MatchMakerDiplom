import * as React from 'react';
import {useDemoRouter} from "@toolpad/core/internal";
import {matchPath} from "react-router-dom";
import {Create, CrudProvider, Edit, List, Show} from "@toolpad/core/Crud";

function CrudRoutes({ basePath, entityName, dataSource, dataSourceCache }) {
    const router = useDemoRouter(basePath);
    const listPath = basePath;
    const showPath = `${basePath}/:id`;
    const createPath = `${basePath}/new`;
    const editPath = `${basePath}/:id/edit`;

    const title = React.useMemo(() => {
        if (router.pathname === createPath) return `New ${entityName}`;
        const editMatch = matchPath(editPath, router.pathname);
        if (editMatch) return `${entityName} ${editMatch.params.id} - Edit`;
        const showMatch = matchPath(showPath, router.pathname);
        if (showMatch) return `${entityName} ${showMatch.params.id}`;
        return undefined;
    }, [createPath, editPath, router.pathname, showPath]);

    const navigateTo = React.useCallback((path) => router.navigate(path), [router]);
    const handleRowClick = (id) => navigateTo(`${basePath}/${id}`);
    const handleCreateClick = () => navigateTo(createPath);
    const handleEditClick = (id) => navigateTo(`${basePath}/${id}/edit`);
    const handleBackToList = () => navigateTo(listPath);

    const showMatch = matchPath(showPath, router.pathname);
    const editMatch = matchPath(editPath, router.pathname);

    return (
        <CrudProvider dataSource={dataSource} dataSourceCache={dataSourceCache}>
            {router.pathname === listPath && (
                <List onRowClick={handleRowClick} onCreateClick={handleCreateClick} />
            )}
            {router.pathname === createPath && (
                <Create onSubmitSuccess={handleBackToList} />
            )}
            {showMatch && (
                <Show id={showMatch.params.id} onEditClick={handleEditClick} onDelete={handleBackToList} />
            )}
            {editMatch && (
                <Edit id={editMatch.params.id} onSubmitSuccess={handleBackToList} />
            )}
        </CrudProvider>
    );
}

export default CrudRoutes;
