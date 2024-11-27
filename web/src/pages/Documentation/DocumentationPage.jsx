import { ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Paper,
  Typography,
} from '@mui/material'
import ReactMarkdown from 'react-markdown'
import rehypeSlug from 'rehype-slug'
import rehypeToc from 'rehype-toc'

import Link from 'src/components/utils/Link'

// import admin from '../../../../docs/admin.md?raw'
import home from '../../../../docs/README.md?raw'

const docs = {
  home,
  // admin,
}

const components = {
  a: ({ href, title, children }) => (
    <Link href={href} title={title} underline={'always'}>
      {children}
    </Link>
  ),

  p: ({ children }) => <Typography sx={{ mt: 1 }}>{children}</Typography>,
  del: ({ children }) => (
    <Typography component="span" sx={{ mt: 1, textDecoration: 'line-through' }}>
      {children}
    </Typography>
  ),
  em: ({ children }) => (
    <Typography component="span" sx={{ mt: 1, fontStyle: 'italic' }}>
      {children}
    </Typography>
  ),
  strong: ({ children }) => (
    <Typography component="span" sx={{ mt: 1, fontWeight: 'bold' }}>
      {children}
    </Typography>
  ),
  b: ({ children }) => (
    <Typography component="span" sx={{ mt: 1, fontWeight: 'bold' }}>
      {' '}
      {children}{' '}
    </Typography>
  ),
  h1: ({ children, id }) => (
    <Typography id={id} gutterBottom sx={{ mt: 2 }} variant={'h1'}>
      {children}
    </Typography>
  ),
  h2: ({ children, id }) => (
    <Typography
      id={id}
      gutterBottom
      sx={{ mt: 2, textTransform: 'uppercase' }}
      variant={'h2'}
      color={'secondary'}
    >
      {children}
    </Typography>
  ),
  h3: ({ children, id }) => (
    <Typography
      id={id}
      gutterBottom
      sx={{ mt: 2, fontWeight: 400 }}
      variant={'h3'}
    >
      {children}
    </Typography>
  ),
  h4: ({ children, id }) => (
    <Typography
      id={id}
      variant="subtitle1"
      gutterBottom
      sx={{ mt: 2, fontStyle: 'italic' }}
    >
      {children}
    </Typography>
  ),
  h5: ({ children, id }) => (
    <Typography id={id} gutterBottom sx={{ mt: 2 }} variant={'h5'}>
      {children}
    </Typography>
  ),
  h6: ({ children, id }) => (
    <Typography id={id} gutterBottom sx={{ mt: 2 }} variant={'h6'}>
      {children}
    </Typography>
  ),
  hr: () => <Divider sx={{ my: 2 }} />,
  nav: ({ children }) => (
    <nav>
      <Accordion sx={{ mt: 2, bgcolor: '#f6f6f6' }} defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h2">Table of Contents</Typography>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </nav>
  ),
}

const DocumentationPage = ({ page = 'home' }) => {
  return (
    <Box p={2}>
      <Paper
        sx={{
          p: 3,
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            scrollMarginTop: '64px',
          },
          '& nav ol': {
            listStyleType: 'disc',
            margin: 0,
          },
          '& .markdown-body h1': {
            display: 'none',
          },
        }}
      >
        <Typography variant="h1" className="doc-header" gutterBottom>
          Memoryhole User Documentation
        </Typography>
        <Divider />
        <Box className="markdown-body">
          <ReactMarkdown
            rehypePlugins={[
              rehypeSlug,
              [
                rehypeToc,
                {
                  headings: ['h2', 'h3', 'h4', 'h5', 'h6'],
                  position: 'afterend',
                },
              ],
            ]}
            components={components}
          >
            {docs[page.replace(/\.md$/, '')]}
          </ReactMarkdown>
        </Box>
      </Paper>
    </Box>
  )
}

export default DocumentationPage
