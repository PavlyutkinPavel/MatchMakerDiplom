import * as React from 'react';
import {useDemoRouter} from "@toolpad/core/internal";
import {matchPath} from "react-router-dom";
import {Create, CrudProvider, Edit, List, Show} from "@toolpad/core/Crud";
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "../../../shared-theme/AppTheme";

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
        <AppTheme>
            <CssBaseline enableColorScheme />
            <CrudProvider dataSource={dataSource} dataSourceCache={dataSourceCache}>
                {router.pathname === listPath && (
                    <List onRowClick={handleRowClick} onCreateClick={handleCreateClick} sx={{
                        mb: 3,
                        mt: 3,
                        pt: 1,
                        pb: 2,
                    }}/>
                )}
                {router.pathname === createPath && (
                    <Create onSubmitSuccess={handleBackToList} sx={{
                        mb: 3,
                        mt: 3,
                        pt: 1,
                        pb: 2,
                    }}/>
                )}
                {showMatch && (
                    <Show id={showMatch.params.id} onEditClick={handleEditClick} onDelete={handleBackToList} sx={{
                        mb: 3,
                        mt: 3,
                        pt: 1,
                        pb: 2,
                    }}/>
                )}
                {editMatch && (
                    <Edit id={editMatch.params.id} onSubmitSuccess={handleBackToList} sx={{
                        mb: 3,
                        mt: 3,
                        pt: 1,
                        pb: 2,
                    }}/>
                )}
            </CrudProvider>
        </AppTheme>
    );
}

export default CrudRoutes;
