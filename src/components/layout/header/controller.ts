import { useNavigate } from "react-router-dom"

export function useHeaderController() {
  const navigate = useNavigate()

  function handlePage(navigation: string) {
    navigate(navigation)
  }

  return {
    route: {
      handlePage,
      navigate,
    },
  }
}
