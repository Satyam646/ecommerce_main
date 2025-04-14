import React, { useEffect,useState } from "react"
import { Stack, TextField ,Skeleton, Fab, Zoom,Box,Typography} from "@mui/material"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Grid from "@mui/material/Grid2"
import { getApi } from "../../api"
import CheckBox from "./CheckBox"
import RadioBox from "./RadioBox"
import { prices }  from "./Prices"
import { postProductApi } from "../../api"
import Cards from "../Home/Cards"
import { useContext } from 'react';
import Alert from '@mui/material/Alert';
import { ThemeContext } from '../../Common/ThemeContext/ThemeContext';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
export default function Shop(){
    const { SnackBar, toggleSnackBar } = useContext(ThemeContext)
        const [values,setValues] =  useState({
            categories:[{}],
            error:""
        });
        const [isLoading,setLoading]=useState(false);
        const [products,setProducts] = useState([{}]);
        const [error,setError] = useState([{}]);
        const [myfilter, setFilter] = useState({
            filter: {category:[] , price:[]}
        });    
        const handleFilters = (filters, filterBy) => {
             let arr=[];
            console.log(filters, filterBy);
            // Destructure the current filter state
            const currentFilters = {...myfilter.filter};
            // Update the specific filter based on filterBy
            if(filterBy=="price"){
                let priceDetail=prices.filter((item)=>item.id==filters)[0].array;
                console.log(priceDetail);
                currentFilters[filterBy]=priceDetail;
            }else{
                currentFilters[filterBy]=filters;
            }
            setFilter({ filter: currentFilters });
        };
    const getCategories=()=>{
        setLoading(true);
         getApi("category").then(data=>{
                        if(data?.error){
                           setValues({...values,error:data?.error});
                        }else{
                            setLoading(false);
                            setValues({...values,categories:data?.category});
                        }
                    })
    
    }
    const ProductLayout = () => {
        const [showScroll, setShowScroll] = useState(false);
      
        const handleScroll = () => {
          if (window.scrollY > 300) {
            setShowScroll(true);
          } else {
            setShowScroll(false);
          }
        };
      
        const scrollToTop = () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        };
      
        useEffect(() => {
          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
        }, []);
      
        return (
          <Stack sx={{ px: { xs: 1, md: 4 }, py: { xs: 2, md: 4 }, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <Grid container spacing={2} >
              {/* Sidebar Filters */}
              <Grid item size={{xs:12, md:3}}>
                <Stack
                  sx={{
                    position: { md: 'sticky' },
                    top: { md: '100px' },
                    p: 2,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  }}
                  spacing={3}
                >
                  <CheckBox categories={values?.categories} handleFilters={handleFilters} />
                  <RadioBox prices={prices} handleFilters={handleFilters} />
                </Stack>
              </Grid>
      
              {/* Product Grid */}
              <Grid item size={{xs:12, md:9}}>
                <Grid container spacing={9} sx={{ marginTop: { xs: 2, md: 0 } }}>
                  {isLoading
                    ? Array.from({ length: 8 }).map((_, index) => (
                        <Grid key={index} item xs={12} sm={6} md={3} lg={3}>
                          <Skeleton variant="rectangular" height={250} width={250} sx={{ borderRadius: 2 }} />
                          <Skeleton variant="text" width="80%" />
                          <Skeleton variant="text" width="60%" />
                        </Grid>
                      ))
                    : products.length > 0
                    ? products.map((product, index) => (
                        <Grid key={index} item xs={12} sm={6} md={3} lg={3}>
                          <Cards product={product} />
                        </Grid>
                      ))
                    : (
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            textAlign: 'center',
                            p: 4,
                            backgroundColor: 'white',
                            borderRadius: 2,
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                          }}
                        >
                          <Typography variant="h6" sx={{ color: '#333B6A', mb: 1 }}>
                            No Products Found
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Try adjusting your filters or searching something else.
                          </Typography>
                        </Box>
                      </Grid>
                    )
                  }
                </Grid>
              </Grid>
            </Grid>
      
            {showSnackBar()}
      
            {/* Scroll to Top Button */}
            <Zoom in={showScroll}>
              <Fab
                color="primary"
                size="small"
                onClick={scrollToTop}
                sx={{ position: 'fixed', bottom: 20, right: 20, backgroundColor: '#333B6A', '&:hover': { backgroundColor: '#2a315b' } }}
              >
                <KeyboardArrowUpIcon />
              </Fab>
            </Zoom>
          </Stack>
        );
      };
        const showSnackBar = () => {
                 return (
                     <Snackbar
                         anchorOrigin={{ vertical: 'top', horizontal: "right" }}
                         autoHideDuration={3000}
                         open={SnackBar?.open}
                         // message={SnackBar.message}
                         onClose={() => { toggleSnackBar(false, "") }}
                     >
                         <Alert
                             onClose={() => { toggleSnackBar(false, "") }}
                             severity="success"
                             variant="filled"
                             sx={{ width: '100%' }}
                         >
                             {SnackBar.message}
                         </Alert>
                     </Snackbar>
                 )
             }
     const getProductByFilters= ()=>{
        setLoading(true);
           const body ={
            limit:6,
            skip:0,
            filters:myfilter?.filter
           }
           postProductApi(`product/by/search`,body).then(data=>{
                             if(data?.error){
                                setError(data?.product);
                             }
                             else {
                                setLoading(false);
                               setProducts(data?.product); 
                             }
                         })
            }

    useEffect(()=>{
        getProductByFilters();
    },[myfilter])
    useEffect(()=>{
        getCategories();
    },[])
    return (
        <Stack direction="row" flexWrap="wrap">
           {ProductLayout()}
        </Stack>
    )

};