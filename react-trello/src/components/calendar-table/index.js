import React from "react";
// import { makeData, Logo, Tips } from "../calendar-data";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"


// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

const TableDndApp = () => {
    // const [data, setData] = useState('makeData()')
    // const newPerson = {
    //     firstName: 'Pesho',
    //     lastName: 'Peshev',
    //     age: Math.floor(Math.random() * 30),
    //     visits: Math.floor(Math.random() * 100),
    //     progress: Math.floor(Math.random() * 100)
    // }
    // const range = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]


    //     const data = await function() {
    //     return range.map(d => {
    //         return {
    //             ...newPerson(),
    //             children: range(10).map(newPerson)
    //         };
    //     });
    // }
    const tableData = 
        [
            {
                name: 'Kim Parrish',
                address: '4420 Valley Street, Garnerville, NY 10923',
                date: '07/11/2020',
                order: '87349585892118',
            },
            {
                name: 'Michele Castillo',
                address: '637 Kyle Street, Fullerton, NE 68638',
                date: '07/11/2020',
                order: '58418278790810',
            },
            {
                name: 'Eric Ferris',
                address: '906 Hart Country Lane, Toccoa, GA 30577',
                date: '07/10/2020',
                order: '81534454080477',
            },
            {
                name: 'Gloria Noble',
                address: '2403 Edgewood Avenue, Fresno, CA 93721',
                date: '07/09/2020',
                order: '20452221703743',
            },
            {
                name: 'Darren Daniels',
                address: '882 Hide A Way Road, Anaktuvuk Pass, AK 99721',
                date: '07/07/2020',
                order: '22906126785176',
            },
            {
                name: 'Ted McDonald',
                address: '796 Bryan Avenue, Minneapolis, MN 55406',
                date: '07/07/2020',
                order: '87574505851064',
            },
        ]
        
    

    const DragTrComponent = (props) => {

        const { children = null, rowInfo } = props;
        if (rowInfo) {
            debugger;
            const { original, index } = rowInfo;
            const { firstName } = original;
            return (
                <Draggable key={firstName} index={index} draggableId={firstName}>
                    {(draggableProvided, draggableSnapshot) => (
                        <div
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                        >
                            <ReactTable.defaultProps.TrComponent>
                                {children}
                            </ReactTable.defaultProps.TrComponent>
                        </div>
                    )}
                </Draggable>
            )
        } else
            return (
                <ReactTable.defaultProps.TrComponent>
                    {children}
                </ReactTable.defaultProps.TrComponent>
            )

    }

    const DropTbodyComponent = (props) => {

        const { children = null } = props

        return (
            <Droppable droppableId="droppable">
                {(droppableProvided, droppableSnapshot) => (
                    <div ref={droppableProvided.innerRef}>
                        <ReactTable.defaultProps.TbodyComponent>
                            {children}
                        </ReactTable.defaultProps.TbodyComponent>
                    </div>
                )}
            </Droppable>
        )

    }


    const handleDragEnd = result => {
        if (!result.destination) {
            return
        }

        const newData = reorder(
           tableData,
            result.source.index,
            result.destination.index
        );

        tableData = newData

    };

    const getTrProps = (props, rowInfo) => {
        //  console.log(rowInfo);
        return { rowInfo };
    };

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }



    return (
        <div>
            <DragDropContext onDragEnd={handleDragEnd}>
                <ReactTable
                    TrComponent={DragTrComponent}
                    TbodyComponent={DropTbodyComponent}
                    getTrProps={getTrProps}
                    data={tableData}
                    columns={[
                        {
                            Header: "Monday",
                            accessor: "monday"
                        },
                        {
                            Header: "Tuesday",
                            accessor: "tuesday"
                        },
                        {
                            Header: "Wednesday",
                            accessor: "wednesday"
                        },
                        {
                            Header: "Thursday",
                            accessor: "thursday"
                        },
                        {
                            Header: "Friday",
                            accessor: "friday"
                        },
                        {
                            Header: "Saturday",
                            accessor: "saturday"
                        },
                        {
                            Header: "Sunday",
                            accessor: "sunday"
                        }
                    ]}
                    defaultPageSize={5}
                    className="-striped -highlight"
                />
            </DragDropContext>
        </div>
    )

}

export  default TableDndApp


// import React from "react";
// import { render } from "react-dom";
// import { makeData, Logo, Tips } from "../calendar-data";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// // Import React Table
// import ReactTable from "react-table";
// // import "react-table/react-table.css";

// export default function CalendarTable() {

//     class DragTrComponent extends React.Component {
//         render() {
//             const { children = null, rowInfo } = this.props;
//             if (rowInfo) {
//                 debugger;
//                 const { original, index } = rowInfo;
//                 const { firstName } = original;
//                 return (
//                     <Draggable key={firstName} index={index} draggableId={firstName}>
//                         {(draggableProvided, draggableSnapshot) => (
//                             <div
//                                 ref={draggableProvided.innerRef}
//                                 {...draggableProvided.draggableProps}
//                                 {...draggableProvided.dragHandleProps}
//                             >
//                                 <ReactTable.defaultProps.TrComponent>
//                                     {children}
//                                 </ReactTable.defaultProps.TrComponent>
//                             </div>
//                         )}
//                     </Draggable>
//                 );
//             } else
//                 return (
//                     <ReactTable.defaultProps.TrComponent>
//                         {children}
//                     </ReactTable.defaultProps.TrComponent>
//                 );
//         }
//     }

//     class DropTbodyComponent extends React.Component {
//         render() {
//             const { children = null } = this.props;

//             return (
//                 <Droppable droppableId="droppable">
//                     {(droppableProvided, droppableSnapshot) => (
//                         <div ref={droppableProvided.innerRef}>
//                             <ReactTable.defaultProps.TbodyComponent>
//                                 {children}
//                             </ReactTable.defaultProps.TbodyComponent>
//                         </div>
//                     )}
//                 </Droppable>
//             );
//         }
//     }

//     class TableDndApp extends React.Component {
//         constructor() {
//             super();
//             this.state = {
//                 data: makeData()
//             };
//         }
//         handleDragEnd = result => {
//             if (!result.destination) {
//                 return;
//             }

//             const data = reorder(
//                 this.state.data,
//                 result.source.index,
//                 result.destination.index
//             );

//             this.setState({
//                 data
//             });
//         };

//         getTrProps = (state, rowInfo) => {
//             console.log(rowInfo);
//             return { rowInfo };
//         };

//         render() {
//             const { data } = this.state;
//             return (
//                 <div>
//                     <DragDropContext onDragEnd={this.handleDragEnd}>
//                         <ReactTable
//                             TrComponent={DragTrComponent}
//                             TbodyComponent={DropTbodyComponent}
//                             getTrProps={this.getTrProps}
//                             data={data}
//                             columns={[
//                                 {
//                                     Header: "First Name",
//                                     accessor: "firstName"
//                                 },
//                                 {
//                                     Header: "Last Name",
//                                     id: "lastName",
//                                     accessor: d => d.lastName
//                                 },
//                                 {
//                                     Header: "Age",
//                                     accessor: "age"
//                                 },
//                                 {
//                                     Header: "Status",
//                                     accessor: "status"
//                                 },
//                                 {
//                                     Header: "Visits",
//                                     accessor: "visits"
//                                 }
//                             ]}
//                             defaultPageSize={10}
//                             className="-striped -highlight"
//                         />
//                     </DragDropContext>
//                 </div>
//             );
//         }
//     }

//     const reorder = (list, startIndex, endIndex) => {
//         const result = Array.from(list);
//         const [removed] = result.splice(startIndex, 1);
//         result.splice(endIndex, 0, removed);

//         return result;
//     };

//     render(<TableDndApp />, document.getElementById("root"));
// }
