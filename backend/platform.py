print("MOCK PLATFORM LOADED")
import sys

def system():
    if sys.platform == 'win32':
        return 'Windows'
    elif sys.platform == 'darwin':
        return 'Darwin'
    else:
        return 'Linux'

def release():
    return "10"

def version():
    return "10.0.19041"

def machine():
    return "AMD64"

def processor():
    return "Intel64 Family 6 Model 158 Stepping 10, GenuineIntel"

def python_version():
    return sys.version.split()[0]

def python_implementation():
    return "CPython"

def uname():
    from collections import namedtuple
    UnameResult = namedtuple("uname_result", ["system", "node", "release", "version", "machine", "processor"])
    return UnameResult("Windows", "SafeGo-PC", "10", "10.0.19041", "AMD64", "Intel64 Family 6 Model 158 Stepping 10, GenuineIntel")

def architecture():
    return ("64bit", "WindowsPE")

# Add other common functions as needed
def platform(*args, **kwargs):
    return "Windows-10"

def mac_ver(): return ('', ('', '', ''), '')
def win32_ver(): return ('10', '10.0.19041', 'SP0', 'Multiprocessor Free')
def libc_ver(*args, **kwargs): return ('', '')
