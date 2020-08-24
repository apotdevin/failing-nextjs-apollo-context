export const getContext = (context) => {
  if (!context?.res || !context.req) {
    console.log('Context from getServerSideProps is empty: ', context)
  } else {
    console.log('Context from getServerSideProps is available')
  }
  
  return {foo: 'bar'}
}