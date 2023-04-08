import {Box, Container, Grid, Typography} from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        backgroundColor: "#ffffff",
        paddingTop: "1rem",
        paddingBottom: "1rem",
      }}
    >
      <Container maxWidth="lg">
        <Grid container direction="column" alignItems="center">
          <Grid item xs={12}>
            <Typography color="black" component='span' sx={{marginRight: '24px'}}>
              Copyright © 上海玖义科技有限公司
            </Typography>
            <Typography color="textSecondary" component="a" href='https://beian.miit.gov.cn/' target='_blank'>
              沪ICP备2021038027号-1
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
