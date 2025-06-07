import { PageHeader } from "@/common/PageHeader"
import { SchoolHeader } from "@/common/SchoolHeader"
import { Box } from "@chakra-ui/react"
// import { useState } from "react"

export const OnlinePayFees = () => {
    //     const [inputFeesValue, setInputFeesValue] = useState({ discount: 0, lateFees: 0, date: dayjs().format("YYYY-MM-DD"), feesType: "school-fees", type: "Cash" })
    //     const [toggleReceiptModal, setToggleReceiptModal] = useState(null)
    //     const [headFees, setHeadFees] = useState([])

    //     const inputHandler = (name, val) => {
    //         if (name === "feesType") {
    //             setInputFeesValue({ discount: 0, date: dayjs().format("YYYY-MM-DD"), feesType: val, studentFeesId: "", amount: 0, lateFees: 0, type: "Cash" })
    //             setHeadFees([])
    //         }
    //         else {
    //             setInputFeesValue(pre => ({ ...pre, [name]: val }))
    //         }
    //     }

    //     const addHeadFees = (e) => {
    //         e.preventDefault()
    //         setHeadFees(pre => ([...pre, { studentFeesId: inputFeesValue.studentFeesId, amount: (parseFloat(inputFeesValue.amount) || 0), discount: (parseFloat(inputFeesValue.discount) || 0), lateFees: (parseFloat(inputFeesValue.lateFees) || 0) }]))
    //         setInputFeesValue(pre => ({ ...pre, studentFeesId: "", amount: "", discount: "", lateFees: "" }))
    //     }

    //     const selectHeadHandler = (name, val) => {
    //         setInputFeesValue(pre => ({ ...pre, [name]: val, amount: "", discount: "", lateFees: "" }))
    //     }

    //     const deleteHeadFee = (index) => {
    //         setHeadFees(filter(headFees, (f, i) => i !== index))
    //     }

    //     const { searchStudentAction, searchStudentStatus, searchStd, resetSearch,
    //         getStudentFeesAction, getStudentFeesStatus, studentFees, resetStudentFee,
    //         collectStdFeesAction, collectStdFeesStatus, collectStdFees, resetCollectFee,
    //         getFeesReceiptAction, getFeesReceiptStatus, feeReceiptData, resetFeesReceipt
    //     } = useStdFeesStore(s => ({
    //         searchStudentAction: s.searchStudentAction,
    //         searchStudentStatus: s.searchStudentStatus,
    //         searchStd: s.searchStd,
    //         resetSearch: s.resetSearch,
    //         getStudentFeesAction: s.getStudentFeesAction,
    //         getStudentFeesStatus: s.getStudentFeesStatus,
    //         studentFees: s.studentFees,
    //         resetStudentFee: s.resetStudentFee,
    //         collectStdFeesAction: s.collectStdFeesAction,
    //         collectStdFeesStatus: s.collectStdFeesStatus,
    //         collectStdFees: s.collectStdFees,
    //         resetCollectFee: s.resetCollectFee,
    //         getFeesReceiptAction: s.getFeesReceiptAction,
    //         getFeesReceiptStatus: s.getFeesReceiptStatus,
    //         feeReceiptData: s.feeReceiptData,
    //         resetFeesReceipt: s.resetFeesReceipt
    //     }))

    //     const { getAdminBankAction, getAdminBanksStatus, allAdminBanks } = useAdminBankStore(s => ({
    //         getAdminBankAction: s.getAdminBankAction,
    //         getAdminBanksStatus: s.getAdminBanksStatus,
    //         allAdminBanks: s.allAdminBanks
    //     }))

    //     useEffect(() => {
    //         if ((getAdminBanksStatus || 1) === STATUS.NOT_STARTED) {
    //             getAdminBankAction()
    //         }
    //     }, [getAdminBankAction, getAdminBanksStatus])

    //     const { getBankAction, getBankStatus, allBanks } = useAdditionalSetupStore(s => ({
    //         getBankAction: s.getBankAction,
    //         getBankStatus: s.getBankStatus,
    //         allBanks: s.allBanks
    //     }))

    //     useEffect(() => {
    //         if ((getBankStatus || 1) === STATUS.NOT_STARTED) {
    //             getBankAction()
    //         }
    //     }, [getBankAction, getBankStatus])

    //     const studentFeesDetails = useMemo(() => {
    //         return map(filter(studentFees?.studentFees, s => s.fees_type_master?.id === 1), f => {
    //             const received = filter(f.fees_collects, c => c.status !== "Pending")
    //             return ({
    //                 ...f,
    //                 totalFees: f.amount + f.lateFees,
    //                 tutionFees: f.amount,
    //                 totalLateFees: f.lateFees,
    //                 deposite: sumBy(received, "amount"),
    //                 lateFeesCollected: (sumBy(received, "lateFees") || 0),
    //                 pending: sumBy(filter(f.fees_collects, c => c.status === "Pending"), "amount"),
    //                 discount: sumBy(received, "discount"),
    //                 discountReceived: f.discountReceived,
    //                 amount: (f.amount - (sumBy(received, "amount") + sumBy(received, "discount") + f.discountReceived)),
    //                 dueAmount: (f.amount - (sumBy(f.fees_collects, "amount") + sumBy(f.fees_collects, "discount") + f.discountReceived)),
    //                 dueLateFees: f.lateFees - (sumBy(received, "lateFees") || 0),
    //             })
    //         })
    //     }, [studentFees?.studentFees])

    //     const transportFeesDetails = useMemo(() => {
    //         return map(filter(studentFees?.studentFees, s => s.fees_type_master?.id === 2), f => {
    //             const received = filter(f.fees_collects, c => c.status !== "Pending")
    //             return ({
    //                 ...f,
    //                 totalFees: f.amount + f.lateFees,
    //                 tutionFees: f.amount,
    //                 totalLateFees: f.lateFees,
    //                 deposite: sumBy(received, "amount"),
    //                 lateFeesCollected: (sumBy(received, "lateFees") || 0),
    //                 pending: sumBy(filter(f.fees_collects, c => c.status === "Pending"), "amount"),
    //                 discount: sumBy(received, "discount"),
    //                 discountReceived: f.discountReceived,
    //                 amount: (f.amount - (sumBy(received, "amount") + sumBy(received, "discount") + f.discountReceived)),
    //                 dueAmount: (f.amount - (sumBy(f.fees_collects, "amount") + sumBy(f.fees_collects, "discount") + f.discountReceived)),
    //                 dueLateFees: f.lateFees - (sumBy(received, "lateFees") || 0),
    //             })
    //         })
    //     }, [studentFees?.studentFees])

    //     const handleSearchInput = (val) => {
    //         setSearchInput({ filters: val })
    //         if (val?.length >= 1) {
    //             searchStudentAction({
    //                 sessionMasterId,
    //                 search: val
    //             })
    //         }
    //     }

    //     const feesHandler = (name, val) => {
    //         const feesType = inputFeesValue?.feesType === "transport-fees" ? transportFeesDetails : studentFeesDetails
    //         if (name === "amount" && (val > sumBy(feesType, "amount"))) {
    //             setInputFeesValue(pre => ({ ...pre, [name]: sumBy(feesType, "amount") }))
    //         }
    //         else if (name === "discount" && val > (sumBy(feesType, "amount") - (inputFeesValue?.amount || 0))) {
    //             setInputFeesValue(pre => ({ ...pre, [name]: 0 }))
    //         }
    //         else if (name === "lateFees" && (val > sumBy(feesType, "lateFees"))) {
    //             setInputFeesValue(pre => ({ ...pre, [name]: (sumBy(feesType, "lateFees") || 0) }))
    //         }
    //         else {
    //             setInputFeesValue(pre => ({ ...pre, [name]: val }))
    //         }
    //     }

    //     const headFeesHandler = (name, val) => {
    //         const feesType = inputFeesValue?.feesType === "transport-fees" ? transportFeesDetails : studentFeesDetails
    //         const stdFees = find(feesType, f => f.id === parseInt(inputFeesValue.studentFeesId))
    //         if (name === "amount" && (val > stdFees?.dueAmount)) {
    //             setInputFeesValue(pre => ({ ...pre, [name]: stdFees?.dueAmount }))
    //         }
    //         else if (name === "discount" && val > (stdFees?.dueAmount - (inputFeesValue?.amount || 0))) {
    //             setInputFeesValue(pre => ({ ...pre, [name]: 0 }))
    //         }
    //         else if (name === "lateFees" && (val > (stdFees?.dueLateFees || 0))) {
    //             setInputFeesValue(pre => ({ ...pre, [name]: stdFees?.dueLateFees || 0 }))
    //         }
    //         else {
    //             setInputFeesValue(pre => ({ ...pre, [name]: val }))
    //         }
    //     }

    //     const unSelectedFee = useMemo(() => {
    //         return reject(studentFeesDetails, std => includes(map(headFees, s => parseInt(s.studentFeesId)), std.id))
    //     }, [headFees, studentFeesDetails])

    //     const unSelectedTransportFee = useMemo(() => {
    //         return reject(transportFeesDetails, std => includes(map(headFees, s => parseInt(s.studentFeesId)), std.id))
    //     }, [headFees, transportFeesDetails])

    //     const feesDetail = useMemo(() => {
    //         return find(studentFees?.studentFees, f => f.id === parseInt(inputFeesValue?.studentFeesId))
    //     }, [inputFeesValue?.studentFeesId, studentFees?.studentFees])

    //     const getStudentFees = (id, promotionId) => {
    //         setSearchInput({ filters: '' })
    //         resetSearch()
    //         getStudentFeesAction({
    //             promotionId,
    //             studentMasterId: id,
    //             feesMode: 1,
    //         })
    //     }
    return (
        <Box h={"100%"}>
            <PageHeader heading={"Online Fees Payment"} />
            <Box p={5} bg={"white"} h={"90%"}>
                <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
                    <SchoolHeader />
                </Box>
            </Box>
        </Box>
    )
}