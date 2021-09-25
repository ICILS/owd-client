import {useStore} from "vuex";
import {OwdModuleAppWindowInstance} from "@owd-client/types";

/**
 * Calculate window position
 */
export function calcPosition(owdModuleAppWindow: OwdModuleAppWindowInstance) {
  return {
    x: calcPositionX(owdModuleAppWindow),
    y: calcPositionY(owdModuleAppWindow),
    z: owdModuleAppWindow.storage.position.z
  }
}

/**
 * Calculate x position for new opened windows
 */
export function calcPositionX(owdModuleAppWindow: OwdModuleAppWindowInstance) {
  const pageWindow = window

  const desktopWindowsContainer = document.querySelector('.owd-windows-container')
  const desktopWindowsContainerArea = document.querySelector('.owd-windows-container__initialize-area')

  if (desktopWindowsContainerArea && desktopWindowsContainer) {
    const desktopWindowsContainerOffset = desktopWindowsContainer.getBoundingClientRect()
    const desktopWindowsContainerAreaOffset = desktopWindowsContainerArea.getBoundingClientRect()

    const maxPositionLeft = owdModuleAppWindow.storage.position.x + owdModuleAppWindow.storage.size.width + desktopWindowsContainerOffset.left

    let x = owdModuleAppWindow.storage ? owdModuleAppWindow.storage.position.x : desktopWindowsContainerOffset.left

    if (pageWindow.innerWidth < owdModuleAppWindow.storage.size.width) {
      return 0
    }

    if (owdModuleAppWindow.storage.position.x === 0) {
      return desktopWindowsContainerAreaOffset.left - desktopWindowsContainerOffset.left
    }

    if (owdModuleAppWindow.storage.position.x < 0 || maxPositionLeft > pageWindow.innerWidth) {
      return desktopWindowsContainerAreaOffset.width + desktopWindowsContainerAreaOffset.left - desktopWindowsContainerOffset.left - owdModuleAppWindow.storage.size.width
    }

    if (owdModuleAppWindow.storage.position.x > 0) {
      if (owdModuleAppWindow.storage.position.x > (desktopWindowsContainerAreaOffset.width - desktopWindowsContainerAreaOffset.left)) {
        return desktopWindowsContainerAreaOffset.left - desktopWindowsContainerOffset.left
      }

      return owdModuleAppWindow.storage.position.x
    }

    return x
  }

  return 0
}

/**
 * Calculate y position for new opened windows
 */
export function calcPositionY(owdModuleAppWindow: OwdModuleAppWindowInstance) {
  const pageWindow = window

  const desktopWindowsContainer = document.querySelector('.owd-windows-container')
  const desktopWindowsContainerArea = document.querySelector('.owd-windows-container__initialize-area')

  if (desktopWindowsContainerArea && desktopWindowsContainer) {
    const desktopWindowsContainerOffset = desktopWindowsContainer.getBoundingClientRect()
    const desktopWindowsContainerAreaOffset = desktopWindowsContainerArea.getBoundingClientRect()
    
    if (desktopWindowsContainerAreaOffset.height < owdModuleAppWindow.storage.size.height) {
      return 0
    }

    if (owdModuleAppWindow.storage.position.y < 0) {
      return desktopWindowsContainerAreaOffset.height + desktopWindowsContainerAreaOffset.top - desktopWindowsContainerOffset.top - owdModuleAppWindow.storage.size.height
    }

    if (
      (pageWindow.innerHeight < owdModuleAppWindow.storage.position.y + owdModuleAppWindow.storage.size.height + desktopWindowsContainerOffset.top)
      || (owdModuleAppWindow.storage.position.y + owdModuleAppWindow.storage.size.height > desktopWindowsContainerOffset.bottom)
    ) {
      return desktopWindowsContainerAreaOffset.height + desktopWindowsContainerAreaOffset.top - desktopWindowsContainerOffset.top - owdModuleAppWindow.storage.size.height
    }

    if (owdModuleAppWindow.storage.position.y === 0) {
      return desktopWindowsContainerAreaOffset.top - desktopWindowsContainerOffset.top
    }

    if (owdModuleAppWindow.storage.position.y > 0) {
      if (owdModuleAppWindow.storage.position.y > (desktopWindowsContainerAreaOffset.height - desktopWindowsContainerAreaOffset.top)) {
        return desktopWindowsContainerAreaOffset.top - desktopWindowsContainerOffset.top
      }

      return owdModuleAppWindow.storage.position.y
    }
  }

  return 0
}

// WINDOW INSTANCES

/**
 * Find window by attr
 *
 * @param attr
 * @param value
 */
export function findWindowInstanceByAttr(attr: string, value: string) {
  const store = useStore()

  return store.getters['core/window/modulesAppWindowInstances']
    .find((owdModuleAppWindowInstance: OwdModuleAppWindowInstance) => {
      if (attr === 'uniqueID') {
        return owdModuleAppWindowInstance.uniqueID === value
      }
      if (attr === 'uniqueName') {
        return owdModuleAppWindowInstance.uniqueName === value
      }
      if (attr === 'name') {
        return owdModuleAppWindowInstance.config.name === value
      }
    })
}