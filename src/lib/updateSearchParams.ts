export default function updateSearchParams(name: string, value: string) {
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;

  // Update or add the parameter
  searchParams.set(name, value);

  // Replace the current URL without reloading the page
  history.replaceState(null, '', `${url.pathname}?${searchParams.toString()}`);
}

// export function updateSearchParamsRouter(name: string, value: string) {
//   const url = new URL(window.location.href);
//   const searchParams = url.searchParams;
//   const router = useRouter()

//   // Update or add the parameter
//   searchParams.set(name, value);

//   // Replace the current URL without reloading the page
//   history(`${url.pathname}?${searchParams.toString()}`);
// }
