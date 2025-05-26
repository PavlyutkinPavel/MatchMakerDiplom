import * as React from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Badge,
    Alert,
    Snackbar,
} from '@mui/material';
import {
    Search as SearchIcon,
} from '@mui/icons-material';

// Mock API endpoints (you'll replace these with real endpoints)
const API_URL = "http://localhost:8080";

const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
});



export const UniversalCrud = ({ entityName, dataSource, initialData = [] }) => {
    const [data, setData] = React.useState(initialData);
    const [loading, setLoading] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });
    const [editMode, setEditMode] = React.useState(false);
    const [currentItem, setCurrentItem] = React.useState(null);

    React.useEffect(() => {
        if (dataSource && dataSource.getMany) {
            fetchData();
        }
    }, []);

    const fetchData = async () => {
        if (!dataSource.getMany) return;

        setLoading(true);
        try {
            const response = await dataSource.getMany({
                paginationModel: { page, pageSize: rowsPerPage }
            });
            setData(response.items || []);
            setLoading(false);
        } catch (error) {
            console.error(`Error fetching ${entityName}:`, error);
            setData(initialData);
            setLoading(false);
            setSnackbar({
                open: true,
                message: `Failed to fetch ${entityName}. Please try again.`,
                severity: 'error'
            });
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleEdit = (item) => {
        setCurrentItem(item);
        setEditMode(true);
    };

    const handleDelete = async (id) => {
        if (!dataSource.deleteOne) return;

        setLoading(true);
        try {
            await dataSource.deleteOne(id);
            setData(data.filter(item => item.id !== id));
            setSnackbar({
                open: true,
                message: `${entityName} deleted successfully!`,
                severity: 'success'
            });
        } catch (error) {
            console.error(`Error deleting ${entityName}:`, error);
            setSnackbar({
                open: true,
                message: `Failed to delete ${entityName}. Please try again.`,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        if (!dataSource.createOne && !dataSource.updateOne) return;

        setLoading(true);
        try {
            if (editMode && currentItem) {
                await dataSource.updateOne(currentItem.id, formData);
                setData(data.map(item => item.id === currentItem.id ? { ...item, ...formData } : item));
                setSnackbar({
                    open: true,
                    message: `${entityName} updated successfully!`,
                    severity: 'success'
                });
            } else {
                const newItem = await dataSource.createOne(formData);
                setData([...data, newItem]);
                setSnackbar({
                    open: true,
                    message: `${entityName} created successfully!`,
                    severity: 'success'
                });
            }
            setEditMode(false);
            setCurrentItem(null);
        } catch (error) {
            console.error(`Error ${editMode ? 'updating' : 'creating'} ${entityName}:`, error);
            setSnackbar({
                open: true,
                message: `Failed to ${editMode ? 'update' : 'create'} ${entityName}. Please try again.`,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        setCurrentItem(null);
    };

    // Filter data based on search query
    const filteredData = data.filter(item => {
        return Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Paginate data
    const displayedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ padding: 2 }}>
            <Paper sx={{ padding: 2, marginBottom: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5">{entityName} Management</Typography>
                    {dataSource.createOne && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                setEditMode(false);
                                setCurrentItem(null);
                            }}
                        >
                            Add New {entityName}
                        </Button>
                    )}
                </Box>

                <TextField
                    fullWidth
                    variant="outlined"
                    label={`Search ${entityName}`}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ marginBottom: 2 }}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                />

                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}>
                        <CircularProgress />
                    </Box>
                ) : displayedData.length === 0 ? (
                    <Alert severity="info">No {entityName} found</Alert>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {dataSource.fields.map(field => (
                                            <TableCell key={field.field}>
                                                {field.headerName}
                                            </TableCell>
                                        ))}
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {displayedData.map((item) => (
                                        <TableRow key={item.id} hover>
                                            {dataSource.fields.map(field => (
                                                <TableCell key={`${item.id}-${field.field}`}>
                                                    {item[field.field]}
                                                </TableCell>
                                            ))}
                                            <TableCell align="right">
                                                <Box>
                                                    {dataSource.updateOne && (
                                                        <Button
                                                            size="small"
                                                            onClick={() => handleEdit(item)}
                                                            sx={{ mr: 1 }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    )}
                                                    {dataSource.deleteOne && (
                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDelete(item.id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                )}
            </Paper>

            {/* Form dialog would go here */}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UniversalCrud;